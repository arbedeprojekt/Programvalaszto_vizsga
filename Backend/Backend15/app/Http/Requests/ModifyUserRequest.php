<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class ModifyUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (Gate::allows('super')) {
            return true;
        }

        if (Gate::allows('admin')) {
            return true;
        }

        return false; // Not authorized if neither
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array 
    {
        $userId = $this->input('id');
        $rules = [
            "id" => [
                "required",
                "exists:users,id" 
            ],
            "name" => [
                "required",
                "min:3",
                "max:20",
                Rule::unique('users')->ignore($userId)
            ],
            "email" => [
                "required",
                "email",
                Rule::unique('users')->ignore($userId)
            ],
            "password" => [
                "nullable", 
                "min:8",
                "regex:/[a-z]/",
                "regex:/[A-Z]/",
                "regex:/[0-9]/"
            ]
        ];

/* 
if (Gate::allows('super')) {
            $rules['admin'] = [
                "required",
                "integer"
            ];
        } else {

            $rules['admin'] = [
                "nullable",
                "integer",
                Rule::in([$originalUser->admin]) // Only allow the current value
            ];
        } */

        return $rules;

    }

    public function messages() 
    {
        return [
            "id.required" => "Felhasználó azonosító megadása kötelező.",
            "id.exists" => "Felhasználó azonosító nem létezik.",
            "name.required" => "Név kötelező",
            "email.required" => "Email kötelező",
            "email.email" => "Nem megfelelő formátum",
            "email.unique" => "Létező email cím",
            "password.min" => "A jelszónak legalább 8 karakter hosszúnak kell lennie",
            "password.regex" => "A jelszónak tartalmaznia kell kisbetűt, nagybetűt és számot",
            "admin.required" => "Jogosultság megadása kötelező.",
            "admin.integer" => "Jogosultság nem szám értékként jön meg."
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        throw new HttpResponseException(response()->json([
            "success" => false,
            "message" => "Adatbeviteli hiba",
            "error" => $validator->errors()
        ]));
    }
}