<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\TagController;
use App\Http\Controllers\api\EventController;
use App\Http\Controllers\api\SubscriptionController;
use App\Http\Middleware\AdminAuthMiddleware;
use App\Http\Controllers\Auth\VerificationController;


Route::post( "/register", [ UserController::class, "register" ]);
Route::post("/login", [UserController::class, "login"]);
Route::get('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');

Route::group([ "middleware" => [ "auth:sanctum" ]], function() {
Route::post( "/logout", [ UserController::class, "logOut" ]);
//keresés
Route::get( "/searchevents", [ EventController::class, "searchEvent" ]);
Route::get( "/searchtags", [ TagController::class, "searchTags" ]);
Route::get( "/searchusers", [ UserController::class, "searchUser" ]);
//felhasználók
Route::get( "/getusers", [ UserController::class, "getUsers" ]);
Route::put( "/updateusers", [ UserController::class, "modifyUser" ]);
Route::delete( "/deleteusers/{id}", [ UserController::class, "destroyUser" ]);
//események
Route::post( "/newevents", [ EventController::class, "newEvent" ]);
Route::put( "/updateevents", [ EventController::class, "modifyEvent" ]);
Route::delete( "/deleteevents/{id}", [ EventController::class, "destroyEvent" ]);
Route::post("/geteventsid",[EventController::class,"getEventId"]);
//tagek
Route::post( "/newtags", [ TagController::class, "newTag" ]);
Route::put( "/updatetags", [ TagController::class, "modifyTag" ]);
Route::delete( "/deletetags/{id}", [ TagController::class, "destroyTag" ]);
Route::post("/gettagid",[TagController::class,"getEventId"]);
//taghez tartozó csoportok
Route::get( "/getgroups", [ TagController::class, "getGroups" ]);
//esemény tag kapcsolat
Route::post('events/{eventId}/tags', [EventController::class, 'attachTags']);
Route::delete('events/{eventId}/tags/{tagId}', [EventController::class, 'detachTag']);
Route::get('tags/{id}/events', [TagController::class, 'getEventsByTag']);
Route::get('events/{id}/tags', [EventController::class, 'getTagsByEvents']);
//feliratkozások
Route::get( "/getsubscriptions", [ SubscriptionController::class, "getSubscriptions" ]);
Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
Route::put('/updatesubscriptions/{eventId}', [SubscriptionController::class, 'updateSubscription']);
Route::delete('/unsubscribe/{eventId}', [SubscriptionController::class, 'unsubscribe']);
//felhasználó címke kapcsolat
Route::post( "/subusertag", [ UserController::class, "subUserTag" ]);
Route::delete( "/unsubusertag", [ UserController::class, "unsubUserTag" ]);

}); 

Route::get( "/events", [ EventController::class, "getEvents" ]);
Route::get( "/tags", [ TagController::class, "getTags" ]);
Route::get('/events-with-tags', [EventController::class, 'getEventsWithTags']);







