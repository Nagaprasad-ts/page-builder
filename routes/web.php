<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

use App\Http\Controllers\PublicPageController;

// Public page catch-all — must be last
Route::get('{slug}', [PublicPageController::class, 'show'])
    ->name('page.show')
    ->where('slug', '[a-z0-9\-]+');
