<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rules;

class EventRequest extends FormRequest
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
            "name"=>"required|min:2|max:40",
            "startDate"=>"date|date_format:Y-m-d|before_or_equal:endDate|nullable",
            "endDate"=>"date|date_format:Y-m-d|after_or_equal:startDate|nullable",
            "startTime"=>"date_format:H:i|nullable",
            "endTime"=>"date_format:H:i|nullable",
            "description" => "nullable|string",
            "locationName" => "nullable|string",
            "locationcountry" => "nullable|string",
            "address" => "nullable|string",
            "state" => "nullable|string",
            "weblink" => "nullable|url",
            "latitude" => "nullable|numeric",
            "longitude" => "nullable|numeric",
            "gpx" => "nullable|string",
        ];
        if ($this->isMethod('patch') || $this->isMethod('put')) {
            $eventId = $this->input('id');
            $rules['name'] .= "|unique:events,name,$eventId"; 
        } else {
            $rules['name'] .= "|unique:events,name";
        }
        return $rules;
    }

    public function messages() {

        return [
            "name.required" => "Esemény neve elvárt.",
            "name.unique" => "Esemény már létezik ezzel a megnevezéssel",
            "name.min" => "Túl rövid esemény név.",
            "name.max" => "Túl hosszú esemény név.",
            "startDate.date" => "Érvényes kezdeti dátum szükséges.",
            "startDate.date_format" => "Kezdeti dátum formátuma helytelen.",
            "startDate.before_or_equal" => "Kezdeti dátum a befejezési dátumnál nem lehet korábban.",
            "endDate.date" => "Érvényes befejezési dátum szükséges.",
            "endDate.date_format" => "Befejezési dátum formátuma helytelen.",
            "endDate.after_or_equal" => "Befejezési dátum a kezdeti dátumnál nem lehet korábban.",
            "startTime.date_format" => "Kezdeti idő formátuma helytelen.",
            "endTime.date_format" => "Befejezési idő formátuma helytelen.",
            
            
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
