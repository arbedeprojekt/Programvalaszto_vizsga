<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ResponseController as Response;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
/* use App\Http\Requests\UserRegisterChecker;
use App\Http\Requests\UserLoginChecker; */
/* use Carbon\Carbon; */
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\User as UserResource;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\ModifyUserRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;
use Illuminate\Support\Str;

class UserController extends ResponseController
{
    public function getUsers() {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $users = User::whereNull('deleted_at')->get();

        return $this->sendResponse( UserResource::collection( $users ), "Felhasználók betöltve");
    }
    public function register( RegisterRequest $request ) {

        $request->validated();

        $user = User::create([
            "name" => $request[ "name" ],
            "email" => $request[ "email" ],
            "password" => bcrypt( $request[ "password" ]),
            "admin" => 0
        ]);

        Mail::to($user->email)->send(new EmailVerification($user));

        return $user;
    }

    public function modifyUser( ModifyUserRequest $request ) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}
        $user = auth( "sanctum" )->user();

        $request->validated();

        $userToUpdate = User::find($request["id"]);

        if (!is_null($userToUpdate)) {
            $userToUpdate->name = $request["name"];
            $userToUpdate->email = $request["email"];
    
            if (isset($request["password"]) && !empty($request["password"])) {
                $userToUpdate->password = bcrypt($request["password"]);
            }
    
            if ($user->admin == 2) { 
                if ($request->has('admin')) {
                    $userToUpdate->admin = $request["admin"];
                }
            } else {

                unset($request['admin']);
            }

            $userToUpdate->save();


            return $this->sendResponse(new UserResource($userToUpdate), "Felhasználó módosítva");
        } else {
            return $this->sendError("Adathiba", ["Nincs ilyen felhasználó"], 404);
    }
    }

    public function destroyUser(int $id) {
        $authCheck = $this->adminAuth(); 
        if ($authCheck) {
            return $authCheck;
        }

        $userToDelete = User::find($id);
        $authUser = auth("sanctum")->user();

        if (!$userToDelete) {
            return $this->sendError("Adathiba", ["Felhasználó nem létezik"], 406);
        }

        if ($authUser->id == $userToDelete->id) {
            return $this->sendError("Jogosultsági hiba", ["Nem törölheti a saját fiókját"], 403);
        }

        if ($authUser->admin < 2 && $userToDelete->admin > 0) {
            return $this->sendError("Jogosultsági hiba", ["Nem törölheti az adminisztrátorokat"], 403);
        }
        $userToDelete->tokens()->delete();
        $userToDelete->delete();

        return $this->sendResponse(new UserResource($userToDelete), "Felhasználó törölve");
    }


    public function login(LoginRequest $request) {
        $request->validated();
        
        $user = User::where('email', $request["name"])->orWhere('name', $request["name"])->first();

        if (!$user) {
            return $this->sendError("Azonosítási hiba", ["Nincs ilyen felhasználó"], 404);
        }
        if ($user->trashed()) {
            return $this->sendError("Azonosítási hiba", ["Felhasználó inaktív"], 403);
        }

        $credentials = [
            "password" => $request["password"]
        ];
        if (filter_var($request["name"], FILTER_VALIDATE_EMAIL)) {
            $credentials['email'] = $request["name"];
        } else {
            $credentials['name'] = $request["name"];
        }

        if (!Auth::attempt($credentials)) {
            return $this->sendError("Azonosítási hiba", ["Helytelen jelszó"], 401);
        }

        $authUser = Auth::user();
        if (is_null($authUser->email_verified_at)) {
            Auth::logout();
            return $this->sendError("Azonosítási hiba", ["Igazolja vissza az e-mail címét a bejelentkezés előtt."], 403);
        }
        $token = $authUser->createToken($authUser->name . "token")->plainTextToken;
        $data = [
            "name" => $authUser->name,
            "admin" => $authUser->admin,
            "token" => $token
        ];

        return $this->sendResponse($data, "Sikeres bejelentkezés");
    }

    public function logout() {

        $user = auth( "sanctum" )->user();
        $user->currentAccessToken()->delete();

        return $this->sendResponse( $user->name, "Sikeres kijelentkezés" );
    }

    
    public function searchUser(LoginRequest $request)
    {
        $request->validate([
            "query" => "required|string|min:1",
        ]);

        $searchTerm = $request->input("query");

        $users = User::where("name", "like", "%$searchTerm%")->get();

        return UserResource::collection($users);
    }

    
    public function subUserTag(Request $request) {

        $user = auth("sanctum")->user();

        $request->validate(['tags' => 'required|array']);

        $existingTagIds = $user->tags()->pluck('id')->toArray();

        $newTagIds = array_diff($request->tags, $existingTagIds);
    
        if (!empty($newTagIds)) {
            $user->tags()->attach($newTagIds);
    
            return $this->sendResponse(new UserResource($user->load('tags')), "Tagek hozzáadva a felhasználóhoz");
        } else {
            return $this->sendError('Already Subscribed', ['message' => 'Már fel van iratkozva a megadott címké(k)re.'], 400);
        }
    }
    
    public function unsubUserTag(Request $request) {

        $user = auth("sanctum")->user();
    
        $request->validate(['tags' => 'required|array']);
    
        $detached = $user->tags()->detach($request->tags);
    

        if ($detached) {
            return $this->sendResponse(new UserResource($user->load('tags')), "Címkék eltávolítva a felhasználótól");
        } else {
            return $this->sendError('Not Subscribed', ['message' => 'Nincs feliratkozva a megadott címkékre.'], 404);
        }
    }
}
