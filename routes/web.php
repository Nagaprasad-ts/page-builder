<?php

use App\Http\Controllers\PublicPageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Draft preview — accessible only to authenticated users
    Route::get('draft/{slug}', [PublicPageController::class, 'preview'])
        ->name('page.preview')
        ->where('slug', '[a-z0-9\-\/]+');
});

require __DIR__.'/settings.php';

// Homepage — serves the published page with slug "home", or the first published page
Route::get('/', [PublicPageController::class, 'home'])->name('home');

// Public page catch-all — must be last
Route::get('{slug}', [PublicPageController::class, 'show'])
    ->name('page.show')
    ->where('slug', '(?!admin($|\/)|draft($|\/))[a-z0-9\-\/]+');
