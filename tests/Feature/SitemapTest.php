<?php

use App\Models\Page;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('sitemap index returns correct XML structure', function (): void {
    $response = $this->get('/sitemap.xml');

    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'text/xml; charset=UTF-8');

    $content = $response->getContent();
    expect($content)->toStartWith('<?xml version="1.0" encoding="UTF-8"?>');
    expect($content)->toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
});

test('sitemap lists published pages and excludes drafts or 404 pages', function (): void {
    // 1. Published page
    Page::factory()->published()->create([
        'slug' => 'about-us',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    // 2. Draft page
    Page::factory()->draft()->create([
        'slug' => 'draft-page',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    // 3. 404 page
    Page::factory()->published()->create([
        'slug' => '404',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $response = $this->get('/sitemap.xml');
    $content = $response->getContent();

    expect($content)->toContain('/about-us');
    expect($content)->not->toContain('/draft-page');
    expect($content)->not->toContain('/404');
});

test('sitemap formats home and other page URLs properly', function (): void {
    // 1. Root page
    Page::factory()->published()->create([
        'slug' => 'home',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    // 2. Sub-page
    Page::factory()->published()->create([
        'slug' => 'services',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    $response = $this->get('/sitemap.xml');
    $content = $response->getContent();

    // home / root should resolve to base URL
    expect($content)->toContain('<loc>'.url('/').'</loc>');
    // other pages resolve to path
    expect($content)->toContain('<loc>'.url('/services').'</loc>');
});

test('saving or deleting a page clears the sitemap cache', function (): void {
    // Pre-populate cache with dummy content
    Cache::forever('sitemap', '<?xml version="1.0" encoding="UTF-8"?><urlset><url><loc>http://dummy.test</loc></url></urlset>');

    $response = $this->get('/sitemap.xml');
    expect($response->getContent())->toContain('http://dummy.test');

    // Trigger save event by creating a new page
    Page::factory()->published()->create([
        'slug' => 'brand-new-page',
        'created_by' => $this->user->id,
        'updated_by' => $this->user->id,
    ]);

    // Cache should be busted, fetching dynamic content
    $response2 = $this->get('/sitemap.xml');
    $content2 = $response2->getContent();

    expect($content2)->not->toContain('http://dummy.test');
    expect($content2)->toContain('/brand-new-page');
});

test('sitemap includes pages with no_index enabled', function (): void {
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

    $response = $this->get('/sitemap.xml');
    $content = $response->getContent();

    expect($content)->toContain('/visible-page');
    expect($content)->toContain('/hidden-page');
});
