<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tag extends Model
{
    use HasFactory;
 
    public function events() {
        return $this->belongsToMany(Event::class, 'eventtags', 'tags_id', 'events_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'tag_subscriptions', 'tags_id', 'users_id');
    }
}
