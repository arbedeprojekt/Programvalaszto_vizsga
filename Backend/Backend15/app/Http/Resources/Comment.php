<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Comment extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
        [
            'user_id' => $this->user_id,
            'event_id' => $this->event_id,
            'comment' => $this->comment,
            'rating' => $this->rating,

        ];
    }
}
