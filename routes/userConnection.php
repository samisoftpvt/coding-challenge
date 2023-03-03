<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/suggestions', [App\Http\Controllers\HomeController::class, 'suggestions'])->name('suggestions');
Route::post('/connect', [App\Http\Controllers\HomeController::class, 'connect'])->name('connect');
Route::get('/requests', [App\Http\Controllers\HomeController::class, 'requests'])->name('requests');
Route::post('/accept', [App\Http\Controllers\HomeController::class, 'accept'])->name('accept');
Route::post('/withdrawal', [App\Http\Controllers\HomeController::class, 'withdrawal'])->name('withdrawal');
Route::get('/connections', [\App\Http\Controllers\HomeController::class, 'connections'])->name('connections');
Route::get('/common-connections', [\App\Http\Controllers\HomeController::class, 'commonConnections'])->name('common.connections');
Route::post('/remove-connection', [App\Http\Controllers\HomeController::class, 'removeConnection'])->name('remove.connection');
