<?php

use App\Models\Page;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('robots.txt returns correct text structure', function (): void {
    $response = $this->get('/robots.txt');

    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'text/plain; charset=UTF-8');

    $content = $response->getContent();
    expect($content)->toContain('User-agent: *');
    expect($content)->toContain('Disallow: /admin/');
    expect($content)->toContain('Sitemap: '.url('sitemap.xml'));
});

test('robots.txt lists pages with no_index and excludes others', function (): void {
    // 1. Published page with no_index = true
    Page::factory()->published()->noIndex()->create([
        'slug' => 'hidden-page',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    // 2. Published page with no_index = false
    Page::factory()->published()->create([
        'slug' => 'visible-page',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    // 3. Draft page with no_index = true (drafts are not listed)
    Page::factory()->draft()->noIndex()->create([
        'slug' => 'draft-hidden-page',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $response = $this->get('/robots.txt');
    $content = $response->getContent();

    expect($content)->toContain('Disallow: /hidden-page');
    expect($content)->not->toContain('Disallow: /visible-page');
    expect($content)->not->toContain('Disallow: /draft-hidden-page');
});

test('saving or deleting a page clears the robots_txt cache', function (): void {
    // Pre-populate cache with dummy content
    Cache::forever('robots_txt', "User-agent: *\nDisallow: /dummy-rule\n");

    $response = $this->get('/robots.txt');
    expect($response->getContent())->toContain('/dummy-rule');

    // Trigger save event by creating a new page with no_index
    Page::factory()->published()->noIndex()->create([
        'slug' => 'brand-new-no-index',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    // Cache should be busted, fetching dynamic content
    $response2 = $this->get('/robots.txt');
    $content2 = $response2->getContent();

    expect($content2)->not->toContain('/dummy-rule');
    expect($content2)->toContain('Disallow: /brand-new-no-index');
});
