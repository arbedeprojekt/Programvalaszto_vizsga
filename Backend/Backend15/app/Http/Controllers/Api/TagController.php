<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\TagRequest;
use App\Models\Tag;
use App\Http\Resources\Tag as TagResource;
use App\Http\Resources\Event as EventResource;

class TagController extends ResponseController
{
    public function getTags() {

        $tags = Tag::all();

        return $this->sendResponse( TagResource::collection( $tags ), "Címkék betöltve");
    }

    public function newTag( TagRequest $request ) {
        
        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}
        /* $request->validated(); */
        $tag = new Tag();

        $tag->name = $request[ "name" ];
        $tag->group = $request[ "group" ];
        $tag->save();

        return $this->sendResponse( new TagResource( $tag ), "Sikeres rögzítés");
    }

    public function modifyTag( TagRequest $request ) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}


        $request->validated();

        $tag = Tag::find($request["id"]);

        if (!is_null($tag)) {

            $newName = $request["name"];
            $newGroup = $request["group"];
            
            if ($tag->name === $newName && $tag->group === $newGroup) {
                return $this->sendResponse(new TagResource($tag), "Nincs változás a címke adatainál.");
            }
    
            $tag->name = $newName;
            $tag->group = $newGroup;
            $tag->save();
    
            return $this->sendResponse(new TagResource($tag), "Címke módosítva");
        } else {
            return $this->sendError("Adathiba", ["Nincs ilyen címke"], 406);
        }

    }

    public function destroyTag( int $id ) {


        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $tag = Tag::find( $id);

        if( !is_null( $tag )) {

            $tag->delete();

            return $this->sendResponse( new TagResource( $tag ), "Címke törölve" );

        }else {

            return $this->sendError( "Adathiba", [ "Címke nem létezik" ], 406 );
        }
    }

    public function getTagId( TagRequest $request ) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $request->validated();
        $tags = Tag::all();
        $tags = Tag::where( "name", $request["name"] )->first();

        $id = $tags->id;

        return $id;
    }

    public function searchTag(TagRequest $request)
    {


        $request->validate([
            "query" => "required|string|min:1",
        ]);

        $searchTerm = $request->input("query");

        $tags = Tag::where("name", "like", "%$searchTerm%")->get();

        return TagResource::collection($tags);
    }

    public function getGroups() {

        $collection = collect(['típus', 'jelleg', 'időtartam', 'részvétel módja', 'belépés']);

        return $this->sendResponse(  $collection, "Csoportok betöltve");
    }

    public function getEventsByTag(int $tagId) {



        $tag = Tag::find($tagId);
    
        if (!$tag) {
            return $this->sendError("Adathiba", ["Nincs ilyen címke"], 404);
        }
    
        $events = $tag->events; 

        if ($events->isEmpty()) {
            return $this->sendResponse([], "Nincs esemény társítva ehhez az címkéhez.");
        }
    
        return $this->sendResponse(EventResource::collection($events), "Címkéhez tartozó események kiírva.");
    }
}
