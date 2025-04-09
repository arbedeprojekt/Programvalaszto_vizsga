<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class Event extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "startDate" => $this->startDate,
            "endDate" => $this->endDate,
            'startTime' => $this->formatTime($this->startTime),
            'endTime' => $this->formatTime($this->endTime),
            "description"=> $this->description,
            "image"=> $this->image,
            "locationName"=> $this->locationName,
            "locationcountry"=> $this->locationcountry,
            "address"=> $this->address,
            "state"=> $this->state,
            "weblink"=> $this->weblink,           
            "latitude"=> $this->latitude,
            "longitude"=> $this->longitude,
            "gpx"=> $this->gpx,
            "subscribed"=> $this->subscribed,
        ];
    }
    protected function formatTime(?string $time): ?string
    {
        if (empty($time)) {
            return null;
        }
        if (!$time) {
            return null;
        }
        return Carbon::createFromFormat('H:i:s', $time)->format('H:i');

    }
}

