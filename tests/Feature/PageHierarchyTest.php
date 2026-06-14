<?php

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('dynamic path generation on parent-child pages', function () {
    $parent = Page::factory()->create([
        'title' => 'Solutions',
        'slug' => 'solutions',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $child = Page::factory()->create([
        'title' => 'Branding',
        'slug' => 'branding',
        'parent_id' => $parent->id,
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    expect($parent->refresh()->path)->toBe('solutions');
    expect($child->refresh()->path)->toBe('solutions/branding');
});

test('recursive path propagation when parent slug changes', function () {
    $parent = Page::factory()->create([
        'title' => 'Solutions',
        'slug' => 'solutions',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $child = Page::factory()->create([
        'title' => 'Branding',
        'slug' => 'branding',
        'parent_id' => $parent->id,
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $grandchild = Page::factory()->create([
        'title' => 'Logo Design',
        'slug' => 'logo-design',
        'parent_id' => $child->id,
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    expect($grandchild->refresh()->path)->toBe('solutions/branding/logo-design');

    // Update parent slug
    $parent->update(['slug' => 'solution']);

    expect($parent->refresh()->path)->toBe('solution');
    expect($child->refresh()->path)->toBe('solution/branding');
    expect($grandchild->refresh()->path)->toBe('solution/branding/logo-design');
});

test('circular reference prevention', function () {
    $parent = Page::factory()->create([
        'title' => 'Solutions',
        'slug' => 'solutions',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $child = Page::factory()->create([
        'title' => 'Branding',
        'slug' => 'branding',
        'parent_id' => $parent->id,
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    // Page cannot be its own parent
    expect(fn () => $parent->update(['parent_id' => $parent->id]))
        ->toThrow(\InvalidArgumentException::class);

    // Parent cannot be descendant
    expect(fn () => $parent->update(['parent_id' => $child->id]))
        ->toThrow(\InvalidArgumentException::class);
});

test('page routing resolves nested paths', function () {
    $parent = Page::factory()->published()->create([
        'title' => 'Solutions',
        'slug' => 'solutions',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $child = Page::factory()->published()->create([
        'title' => 'Branding',
        'slug' => 'branding',
        'parent_id' => $parent->id,
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $this->get('/solutions/branding')
        ->assertOk()
        ->assertInertia(fn ($assert) => $assert
            ->component('site/page')
            ->where('page.id', $child->id)
            ->where('page.path', 'solutions/branding')
        );
});

test('breadcrumbs structure resolution', function () {
    $home = Page::factory()->published()->create([
        'title' => 'Home',
        'slug' => 'home',
        'path' => '/',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $parent = Page::factory()->published()->create([
        'title' => 'Solutions',
        'slug' => 'solutions',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $child = Page::factory()->published()->create([
        'title' => 'Branding',
        'slug' => 'branding',
        'parent_id' => $parent->id,
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $breadcrumbs = $child->getBreadcrumbs();

    expect($breadcrumbs)->toHaveCount(3);
    expect($breadcrumbs[0])->toEqual(['title' => 'Home', 'url' => '/']);
    expect($breadcrumbs[1])->toEqual(['title' => 'Solutions', 'url' => '/solutions']);
    expect($breadcrumbs[2])->toEqual(['title' => 'Branding', 'url' => '/solutions/branding']);
});
