<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
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

// Dynamic sitemap
Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Dynamic robots.txt
Route::get('robots.txt', [RobotsController::class, 'index'])->name('robots');

// Newsletter subscription proxy
Route::post('newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

// Contact form submission proxy to Zoho CRM
Route::post('contact/submit', [ContactController::class, 'submit'])->name('contact.submit');
