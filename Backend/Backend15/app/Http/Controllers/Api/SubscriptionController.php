<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscribeRequest;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Subscription;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class SubscriptionController extends ResponseController
{

    public function getSubscriptions()
    {
        $user = auth('sanctum')->user();

        $subscriptions = Subscription::where('users_id', $user->id)->with('event')->get();

        return $this->sendResponse($subscriptions, 'Feliratkozások betöltve.');
    }

    public function subscribe(SubscribeRequest $request)
    {
        $request->validate([
            'events_id' => 'required|exists:events,id',
            'comment' => 'nullable|string',
        ]);

        $user = auth('sanctum')->user();

        if ($user->admin > 0) { 
            return $this->sendError('Unauthorized Action', ['message' => 'Csak felhasználók iratkozhatnak fel.'], 403);
        }
        $event = Event::find($request->events_id);
        if (!$event) {
            return $this->sendError('Event Not Found', ['message' => 'Esemény nem található.'], 404);
        }

        $subscriptionExists = Subscription::where('users_id', $user->id)
                                           ->where('events_id', $request->events_id)
                                           ->exists();

        if ($subscriptionExists) {
            return $this->sendError('Already Subscribed', ['message' => 'Már fel van iratkozva erre az eseményre.'], 400);
        }

        $subscription = Subscription::create([
            'users_id' => $user->id,
            'events_id' => $request->events_id,
            'comment' => $request->comment,
            'sub_date' => now(),
        ]);

        $event->increment('subscribed');

        return $this->sendResponse($subscription, 'Sikeres föliratkozás.');
    }

    public function updateSubscription(Request $request, $eventId)
    {
        $request->validate([
            'comment' => 'nullable|string',
        ]);

        $user = auth('sanctum')->user();

        $subscription = Subscription::where('users_id', $user->id)
            ->where('events_id', $eventId)
            ->first();

            $event = Event::find($eventId);

            if (!$subscription) {
                return $this->sendError('Not Subscribed', ['message' => 'Nincs feliratkozva erre az eseményre.'], 404);
            }
        
            $event = Event::find($eventId);
        
            if (!$event) {
                return $this->sendError('Event Not Found', ['message' => 'Esemény nem található.'], 404);
            }
            
            if ($event->startDate !== null && now()->lessThanOrEqualTo($event->startDate)) {
                return $this->sendError('Cannot Update Subscription', ['message' => 'Az esemény kezdete még nem járt le.'], 403);
            }
        
            if ($request->filled('comment')) {
                $subscription->comment = $request->input('comment');
                $subscription->save();
            }
        
            return $this->sendResponse($subscription, 'Sikeres rögzítés.');
    }


    public function unsubscribe($eventId)
    {
        $user = auth('sanctum')->user();

        $subscription = Subscription::where('users_id', $user->id)->where('events_id', $eventId)->first();

        if (!$subscription) {
            return $this->sendError('Not Subscribed', ['message' => 'Nincs feliratkozva erre az eseményre.'], 404);
        }

        $subscription->delete();

        $event = Event::find($eventId);
        if ($event) {
            $event->decrement('subscribed');
        }

        return $this->sendResponse(null, 'Sikeres leiratkozás.');
    }
}