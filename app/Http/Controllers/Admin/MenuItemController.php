<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMenuItemRequest;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    /**
     * List all items for a menu (JSON, used by the SPA editor to refresh state).
     */
    public function index(Menu $menu): JsonResponse
    {
        return response()->json([
            'items' => $menu->items()->with('children.page:id,title,slug,path', 'page:id,title,slug,path')->get(),
        ]);
    }

    /**
     * Add a new item to a menu.
     */
    public function store(StoreMenuItemRequest $request, Menu $menu): JsonResponse
    {
        $item = $menu->allItems()->create([
            ...$request->validated(),
            'sort_order' => $request->integer('sort_order', $menu->allItems()->count()),
        ]);

        return response()->json($item->load('page:id,title,slug,path'));
    }

    /**
     * Update an existing menu item.
     */
    public function update(StoreMenuItemRequest $request, Menu $menu, MenuItem $item): JsonResponse
    {
        $item->update($request->validated());

        return response()->json($item->fresh()->load('page:id,title,slug,path'));
    }

    /**
     * Delete a menu item and its children.
     */
    public function destroy(Menu $menu, MenuItem $item): JsonResponse
    {
        // Delete children first
        $item->children()->delete();
        $item->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Bulk reorder items within a menu.
     *
     * Expects: [{ id: number, sort_order: number, parent_id: number|null }, ...]
     */
    public function reorder(Request $request, Menu $menu): JsonResponse
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
            'items.*.parent_id' => ['nullable', 'integer'],
        ]);

        $menuItemIds = $menu->allItems()->pluck('id');

        foreach ($request->input('items') as $data) {
            if (! $menuItemIds->contains($data['id'])) {
                continue;
            }

            MenuItem::where('id', $data['id'])->update([
                'sort_order' => $data['sort_order'],
                'parent_id' => $data['parent_id'] ?? null,
            ]);
        }

        return response()->json(['success' => true]);
    }
}
