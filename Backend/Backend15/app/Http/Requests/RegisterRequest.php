<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
 
        return [
            "name" => "required|min:3|max:20|unique:users,name,NULL,id,deleted_at,NULL",
            "email" => "required|email|unique:users,email,NULL,id,deleted_at,NULL",
            "password" => [ "required",
                            "min:8",
                            "regex:/[a-z]/",
                            "regex:/[A-Z]/",
                            "regex:/[0-9]/"],
            "confirm_password" => "required|same:password"
        ];
    }
    public function messages() {
 
        return [
            "name.required" => "Név kötelező",
            "name.unique" => "Létező név",
            "name.min" => "A név legalább 3 karakterből kell álljon.",
            "name.max" => "A név legfeljebb 20 karakterből állhat.",
            "email.required" => "Email kötelező",
            "email.email" => "Nem megfelelő formátum",
            "email.unique" => "Létező email cím",
            "password.required" => "Jelszó kötelező",
            "password.regex" => "A jelszónak tartalmaznia kell kisbetűt, nagybetűt és számot",
            "password.min" => "A jelszónak legalább 8 karakterből kell állnia.",            
            "confirm_password.required" => "Jelszó ismétlés kötelező",
            "confirm_password.same" => "Nem egyező jelszó"
        ];
    }
    public function failedValidation( Validator $validator ) {
 
        throw new HttpResponseException( response()->json([
            "success" => false,
            "message" => "Adatbeviteli hiba",
            "error" => $validator->errors()
        ]));
    }
}
