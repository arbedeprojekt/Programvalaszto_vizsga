<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ResponseController extends Controller
{
    public function sendResponse( $data, $message ) {

        $response = [
            "success" => true,
            "data" => $data,
            "message" => $message
        ];

        return response()->json( $response, 200 );
    }

    public function sendError( $error, $errorMessages = [], $code = 404 ) {

        $response = [
            "success" => false,
            "message" => $error
        ];

        if( !empty( $errorMessages )) {

            $response[ "errorMessage" ] = $errorMessages;
        }

        return response()->json( $response, $code );
    }

    public function adminAuth(){
        $user = auth( "sanctum" )->user();
        Gate::before( function( $user ) {
            if( $user->admin == 2 ) {
                return true;
            }
        });
        if( !Gate::allows( "admin" )) {

            return $this->sendError( "Azonosítási hiba", "Nincs jogosultság", 401 );
        }
    }
}
