<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscribeRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Allow all users to submit this request
    }

    public function rules()
    {
        return [
            'events_id' => 'required|exists:events,id',
            'comment' => 'nullable|string',
        ];
    }
}