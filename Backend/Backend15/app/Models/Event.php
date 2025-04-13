<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;
 
    public function users() {
        return $this->belongsToMany(User::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function tags() {
        return $this->belongsToMany(Tag::class, 'eventtags', 'events_id', 'tags_id');
    }

    public function subscriptions() {
        return $this->hasMany(Subscription::class);
    }
}
