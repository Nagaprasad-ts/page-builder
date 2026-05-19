<?php

use App\Http\Controllers\Admin\GlobalLayoutController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\MenuItemController;
use App\Http\Controllers\Admin\PageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,editor'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        // Pages — editors can create/edit/draft; only admins can publish
        Route::resource('pages', PageController::class);
        Route::post('pages/{page}/publish', [PageController::class, 'publish'])
            ->name('pages.publish')
            ->middleware('role:admin');
        Route::post('pages/{page}/unpublish', [PageController::class, 'unpublish'])
            ->name('pages.unpublish')
            ->middleware('role:admin');

        // Media — any admin/editor can manage media
        Route::get('media', [MediaController::class, 'index'])->name('media.index');
        Route::post('media', [MediaController::class, 'store'])->name('media.store');
        Route::delete('media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

        // Global layout — admin only
        Route::get('layout', [GlobalLayoutController::class, 'edit'])->name('layout.edit')->middleware('role:admin');
        Route::post('layout', [GlobalLayoutController::class, 'update'])->name('layout.update')->middleware('role:admin');

        // Menus — admin only
        Route::resource('menus', MenuController::class)
            ->middleware('role:admin')
            ->except(['show']);

        Route::get('menus/{menu}/items', [MenuItemController::class, 'index'])
            ->name('menus.items.index')
            ->middleware('role:admin');
        Route::post('menus/{menu}/items', [MenuItemController::class, 'store'])
            ->name('menus.items.store')
            ->middleware('role:admin');
        Route::put('menus/{menu}/items/{item}', [MenuItemController::class, 'update'])
            ->name('menus.items.update')
            ->middleware('role:admin');
        Route::delete('menus/{menu}/items/{item}', [MenuItemController::class, 'destroy'])
            ->name('menus.items.destroy')
            ->middleware('role:admin');
        Route::post('menus/{menu}/items/reorder', [MenuItemController::class, 'reorder'])
            ->name('menus.items.reorder')
            ->middleware('role:admin');
    });
