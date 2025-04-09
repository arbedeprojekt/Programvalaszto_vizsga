<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Gate;

abstract class Controller
{
        public function authorizeAdmin()
    {
        $user = auth()->user();
    
        if (!$user) {
            return response(['error' => 'User not authenticated'], 401);
        }
    
        if (Gate::denies('admin')) {
            return response()->json([
                'error' => 'Azonosítási hiba',
                'message' => 'Nincs jogosultság'
            ], 403);
        }
    
        return null;
    }
}
