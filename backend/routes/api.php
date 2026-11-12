<?php

use App\Http\Controllers\Api\ItemController;
use Illuminate\Support\Facades\Route;

Route::get('/items', [ItemController::class, 'index']);
Route::post('/items', [ItemController::class, 'store']);
Route::patch('/items/{item}/adjust', [ItemController::class, 'adjust']);
Route::delete('/items/{item}', [ItemController::class, 'destroy']);