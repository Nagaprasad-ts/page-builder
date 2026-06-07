<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMenuRequest;
use App\Models\Menu;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    /**
     * List all menus.
     */
    public function index(): Response
    {
        return Inertia::render('admin/menus/index', [
            'menus' => Menu::withCount('allItems')->get(),
        ]);
    }

    /**
     * Show the create-menu form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/menus/create');
    }

    /**
     * Store a new menu.
     */
    public function store(StoreMenuRequest $request): RedirectResponse
    {
        $menu = Menu::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Menu created.']);

        return to_route('admin.menus.edit', $menu);
    }

    /**
     * Show the menu editor.
     */
    public function edit(Menu $menu): Response
    {
        return Inertia::render('admin/menus/edit', [
            'menu' => $menu->load('items.children.page:id,title,slug'),
            'pages' => Page::published()->select('id', 'title', 'slug')->orderBy('title')->get(),
        ]);
    }

    /**
     * Update a menu's name/location.
     */
    public function update(StoreMenuRequest $request, Menu $menu): RedirectResponse
    {
        $menu->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Menu updated.']);

        return back();
    }

    /**
     * Delete a menu and all its items.
     */
    public function destroy(Menu $menu): RedirectResponse
    {
        $menu->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Menu deleted.']);

        return to_route('admin.menus.index');
    }
}
