<?php

use App\Models\User;

test('admin can access admin-only routes', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get('/admin/menus')
        ->assertOk();
});

test('editor is blocked from admin-only routes', function (): void {
    $editor = User::factory()->create(['role' => 'editor']);

    $this->actingAs($editor)
        ->get('/admin/menus')
        ->assertForbidden();
});

test('editor can access editor-allowed routes', function (): void {
    $editor = User::factory()->create(['role' => 'editor']);

    $this->actingAs($editor)
        ->get('/admin/pages')
        ->assertOk();
});

test('unauthenticated user is redirected to login', function (): void {
    $this->get('/admin/pages')->assertRedirect(route('login'));
    $this->get('/admin/menus')->assertRedirect(route('login'));
});
