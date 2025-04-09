<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class VerificationController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (!hash_equals(sha1($user->email), $hash)) {
            return redirect('http://localhost:4200/login')->with('error', 'Érvénytelen ellenőrző link.');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect('http://localhost:4200/login')->with('info', 'Az e-mail már le van igazolva.');
        }

        $user->markEmailAsVerified();

        return redirect('http://localhost:4200/login')->with('success', 'Az e-mail sikeresen igazolva.');
    }
}
