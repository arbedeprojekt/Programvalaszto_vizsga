<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\EventRequest;
use App\Models\Event;
use App\Http\Resources\Event as EventResource;
use App\Http\Controllers\Api\UserController;
use App\Models\Tag;
use Carbon\Carbon;

class EventController extends ResponseController
{
    public function getEvents() {

        $events = Event::all();

        return $this->sendResponse( EventResource::collection( $events ), "Események betöltve");
    }
    public function newEvent( EventRequest $request ) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $event = new Event();

        $event->name = $request["name"];
        $event->startDate = $request["startDate"];
        $event->endDate = $request["endDate"];
        if ($request->has('startTime')) {
            $event->startTime = !empty($request['startTime'])
                ? Carbon::createFromFormat('H:i', $request['startTime'])->format('H:i:s')
                : '00:00:00'; 
        } else {
            $event->startTime = null; 
        }
    
        if ($request->has('endTime')) {
            $event->endTime = !empty($request['endTime'])
                ? Carbon::createFromFormat('H:i', $request['endTime'])->format('H:i:s')
                : '00:00:00'; 
        } else {
            $event->endTime = null; 
        }
        $event->description = $request["description"];
        $event->image = $request["image"];
        $event->locationName = $request["locationName"];
        $event->locationcountry = $request["locationcountry"];
        $event->address = $request["address"];
        $event->state = $request["state"];
        $event->weblink = $request["weblink"];
        $event->latitude = $request["latitude"];
        $event->longitude = $request["longitude"];
        $event->gpx = $request["gpx"];
        $event->save();

        return $this->sendResponse( new EventResource( $event ), "Esemény létrehozva");
    }

    public function modifyEvent( EventRequest $request ) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $event = Event::find( $request["id"] );


        if (!is_null($event)) {

            $newData = [
                'name' => $request["name"],
                'startDate' => $request["startDate"],
                'endDate' => $request["endDate"],
                'startTime' => $request['startTime'],
                'endTime' => $request["endTime"],
                'description' => $request["description"],
                'image' => $request["image"],
                'locationName' => $request["locationName"],
                'locationcountry' => $request["locationcountry"],
                'address' => $request["address"],
                'state' => $request["state"],
                'weblink' => $request["weblink"],
                'latitude' => $request["latitude"],
                'longitude' => $request["longitude"],
            ];

            if ($request->has('startTime')) {
                $newData['startTime'] = !empty($request['startTime'])
                    ? Carbon::createFromFormat('H:i', $request['startTime'])->format('H:i:s')
                    : '00:00:00';
            } else {
                $newData['startTime'] = null;
            }
    
            if ($request->has('endTime')) {
                $newData['endTime'] = !empty($request['endTime'])
                    ? Carbon::createFromFormat('H:i', $request['endTime'])->format('H:i:s')
                    : '00:00:00';
            } else {
                $newData['endTime'] = null;
            }
            if (
                $event->name === $newData['name'] &&
                $event->startDate === $newData['startDate'] &&
                $event->endDate === $newData['endDate'] &&
                (isset($newData['startTime']) ? $event->startTime === $newData['startTime'] : true) &&
                (isset($newData['endTime']) ? $event->endTime === $newData['endTime'] : true) &&
                $event->description === $newData['description'] &&
                $event->image === $newData['image'] &&
                $event->locationName === $newData['locationName'] &&
                $event->locationcountry === $newData['locationcountry'] &&
                $event->address === $newData['address'] &&
                $event->state === $newData['state'] &&
                $event->weblink === $newData['weblink'] &&
                $event->latitude === $newData['latitude'] &&
                $event->longitude === $newData['longitude']
            ) {
                return $this->sendResponse(new EventResource($event), "Nincs változás az esemény adatainál.");
            }
    
            foreach ($newData as $key => $value) {
                if ($request->has($key)) {
                    $event->$key = $value;
                }
            }
    
            $event->save();

            $event->save();

            return $this->sendResponse(new EventResource($event), "Esemény módosítva");

            }else {

                return $this->sendError( "Adathiba", [ "Nincs ilyen esemény" ], 406 );
            }

    }

    public function destroyEvent( int $id ) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $event = Event::find( $id);

        if( !is_null( $event )) {

            $event->delete();

            return $this->sendResponse( new EventResource( $event ), "Esemény törölve" );

        }else {

            return $this->sendError( "Adathiba", [ "Esemény nem létezik" ], 406 );
        }
    }

    public function getEventId( EventRequest $request ) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $request->validated();
        $events = Event::all();
        $events = Event::where( "name", $request["name"] )->first();

        $id = $events->id;

        return $id;
    }

/*     public function searchEvent(EventRequest $request)
    {
        $request->validate([
            "query" => "required|string|min:1",
        ]);

        $searchTerm = $request->input("query");

        $events = Event::where("name", "like", "%$searchTerm%")->get();

        return EventResource::collection($events);
    } */

        public function searchEvent(Request $request)
    {
        
        
        $request->validate([
            "query" => "required|string|min:1",
        ]);
        $searchTerm = $request->input("query");

        $eventsQuery = Event::query();
    
        $searchConditions = function ($query) use ($searchTerm) {
            $query->where("name", "like", "%$searchTerm%")
                  ->orWhere("description", "like", "%$searchTerm%")
                  ->orWhere("locationName", "like", "%$searchTerm%")
                  ->orWhere("locationcountry", "like", "%$searchTerm%")
                  ->orWhere("startDate", "like", "%$searchTerm%")
                  ->orWhere("endDate", "like", "%$searchTerm%")
                  ->orWhere("startTime", "like", "%$searchTerm%")
                  ->orWhere("endTime", "like", "%$searchTerm%");
        };
    
        if ($this->authorizeAdmin() === null) {
            $eventsQuery->where(function ($query) use ($searchConditions, $searchTerm) {
                $query->where("id", intval($searchTerm))
                      ->orWhere($searchConditions);
            });
        } else {
            $eventsQuery->where($searchConditions);
        }
        $events = $eventsQuery->get();

        return EventResource::collection($events);
    }
    
    public function attachTags(Request $request, $eventId) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $request->validate(['tags' => 'required|array']);
        
        $event = Event::find($eventId);
        if (!$event) {
            return $this->sendError('Esemény nem található', ['message' => 'Esemény nem található.'], 404);
        }

        $validTagIds = Tag::whereIn('id', $request->tags)->pluck('id')->toArray();
    
        $missingTagIds = array_diff($request->tags, $validTagIds);
        if (!empty($missingTagIds)) {
            return $this->sendError('Missing Tags', [
                'message' => 'A hozzáadás nem ment végbe. A következő címkék nem találhatók: ' . implode(', ', $missingTagIds)
            ], 404);
        }

        $existingTagIds = $event->tags()->pluck('id')->toArray();
        $newTagIds = array_diff($request->tags, $existingTagIds);
    
        if (!empty($newTagIds)) {
            $event->tags()->attach($newTagIds);
            return $this->sendResponse(new EventResource($event->load('tags')), "Tagek hozzáadva az eseményhez");
        } else {
            return $this->sendError('Nincs új tag', ['message' => 'Az esemény már rendelkezik a megadott címkékkel.'], 200);
        }
    }
    
    public function detachTag($eventId, $tagId) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}

        $event = Event::find($eventId);
    
        if (!$event) {
            return $this->sendError("Adathiba", ["Nincs ilyen esemény"], 404);
        }
    
        $event->tags()->detach($tagId);
    
        return $this->sendResponse(new EventResource($event->load('tags')), "Címke eltávolítva az eseményről");
    }

    public function getTagsByEvents(int $eventId) {

        $authCheck = $this->adminAuth(); 
        if ($authCheck) {return $authCheck;}
        $event = Event::find($eventId);
    
        if (!$event) {
            return $this->sendError("Adathiba", ["Nincs ilyen esemény"], 404);
        }
    
        $tags = $event->tags; 

        if ($tags->isEmpty()) {
            return $this->sendResponse([], "Nincs címke társítva ehhez az eseményhez.");
        }
    
    
        return $this->sendResponse(EventResource::collection($tags), "Eseményhez tartozó címkék kiírva.");
    }

    public function getEventsWithTags()
    {
        
        $events = Event::has('tags')->with('tags')->get();

        if ($events->isEmpty()) {
            return $this->sendResponse([], "Nincsenek események címkékkel.");
        }

        return $this->sendResponse($events, "Események címkékkel visszaadva.");
    }
}
