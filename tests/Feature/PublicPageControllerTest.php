<?php

use App\Models\Page;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('published page renders at its slug', function (): void {
    $page = Page::factory()->published()->create([
        'slug' => 'our-story',
        'title' => 'Our Story',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $this->get('/our-story')
        ->assertOk()
        ->assertInertia(fn (Assert $assert) => $assert
            ->component('site/page')
            ->where('page.id', $page->id)
            ->where('page.slug', 'our-story')
        );
});

test('draft page returns 404', function (): void {
    Page::factory()->draft()->create([
        'slug' => 'hidden-page',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $this->get('/hidden-page')->assertNotFound();
});

test('unknown slug returns 404', function (): void {
    $this->get('/this-page-does-not-exist')->assertNotFound();
});

test('unknown slug returns custom 404 page if seeded and published', function (): void {
    $user = User::factory()->create();
    $page = Page::factory()->published()->create([
        'slug' => '404',
        'title' => 'error.tsx',
        'created_by' => $user->id,
        'updated_by' => $user->id,
    ]);

    $this->get('/this-page-does-not-exist')
        ->assertStatus(404)
        ->assertInertia(fn (Assert $assert) => $assert
            ->component('site/page')
            ->where('page.id', $page->id)
        );
});

test('page contains no_index property', function (): void {
    $page = Page::factory()->published()->noIndex()->create([
        'slug' => 'no-index-page',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $this->get('/no-index-page')
        ->assertOk()
        ->assertInertia(fn (Assert $assert) => $assert
            ->component('site/page')
            ->where('page.no_index', true)
        );
});
