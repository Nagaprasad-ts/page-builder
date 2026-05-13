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
