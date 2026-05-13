<?php

use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->editor = User::factory()->create(['role' => 'editor']);
});

test('admin can view menus list', function (): void {
    Menu::factory()->count(2)->create();

    $this->actingAs($this->admin)
        ->get('/admin/menus')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/menus/index')
            ->has('menus', 2)
        );
});

test('editor cannot access menus', function (): void {
    $this->actingAs($this->editor)
        ->get('/admin/menus')
        ->assertForbidden();
});

test('admin can create a menu', function (): void {
    $this->actingAs($this->admin)
        ->post('/admin/menus', [
            'name' => 'Main Nav',
            'location' => 'desktop_nav',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('menus', ['name' => 'Main Nav', 'location' => 'desktop_nav']);
});

test('admin can add a menu item', function (): void {
    $menu = Menu::factory()->create();

    $this->actingAs($this->admin)
        ->postJson("/admin/menus/{$menu->id}/items", [
            'label' => 'Home',
            'type' => 'url',
            'url' => '/',
            'target' => '_self',
        ])
        ->assertOk()
        ->assertJsonPath('label', 'Home');

    $this->assertDatabaseHas('menu_items', ['menu_id' => $menu->id, 'label' => 'Home']);
});

test('admin can delete a menu item', function (): void {
    $menu = Menu::factory()->create();
    $item = MenuItem::factory()->create(['menu_id' => $menu->id]);

    $this->actingAs($this->admin)
        ->deleteJson("/admin/menus/{$menu->id}/items/{$item->id}")
        ->assertOk()
        ->assertJson(['success' => true]);

    $this->assertDatabaseMissing('menu_items', ['id' => $item->id]);
});

test('admin can reorder menu items', function (): void {
    $menu = Menu::factory()->create();
    $item1 = MenuItem::factory()->create(['menu_id' => $menu->id, 'sort_order' => 0]);
    $item2 = MenuItem::factory()->create(['menu_id' => $menu->id, 'sort_order' => 1]);

    $this->actingAs($this->admin)
        ->postJson("/admin/menus/{$menu->id}/items/reorder", [
            'items' => [
                ['id' => $item1->id, 'sort_order' => 1, 'parent_id' => null],
                ['id' => $item2->id, 'sort_order' => 0, 'parent_id' => null],
            ],
        ])
        ->assertOk()
        ->assertJson(['success' => true]);

    $this->assertDatabaseHas('menu_items', ['id' => $item1->id, 'sort_order' => 1]);
    $this->assertDatabaseHas('menu_items', ['id' => $item2->id, 'sort_order' => 0]);
});

test('admin can delete a menu', function (): void {
    $menu = Menu::factory()->create();

    $this->actingAs($this->admin)
        ->delete("/admin/menus/{$menu->id}")
        ->assertRedirect(route('admin.menus.index'));

    $this->assertDatabaseMissing('menus', ['id' => $menu->id]);
});
