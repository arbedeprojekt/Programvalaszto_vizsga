<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rules;

class TagRequest extends FormRequest
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
    public function rules(): array
    {
        $rules = [
            "name" => "required|min:2|max:20",
            "group" => "required"
        ];
    
        if ($this->isMethod('patch') || $this->isMethod('put')) {
            $tagId = $this->input('id');
            $rules['name'] .= "|unique:tags,name,$tagId"; 
        } else {

            $rules['name'] .= "|unique:tags,name";
        }
    
        return $rules;

    }

    public function messages() {

        return [
            "name.required" => "Címke neve elvárt.",
            "name.unique" => "Címke már létezik ezzel a megnevezéssel",
            "name.min" => "Túl rövid címke név.",
            "name.max" => "Túl hosszú címke név.",
            "group.required" => "Csoport elvárt.",
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
