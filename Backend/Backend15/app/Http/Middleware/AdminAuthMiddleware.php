<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthMiddleware
{
    public function handle($request, Closure $next)
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

        return $next($request);
    }
}