<?php

use App\Models\Page;
use App\Models\PageSection;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->editor = User::factory()->create(['role' => 'editor']);
});

test('guests are redirected from admin pages', function (): void {
    $this->get('/admin/pages')->assertRedirect(route('login'));
});

test('admin can view pages list', function (): void {
    Page::factory()->count(3)->create(['created_by' => $this->admin->id, 'updated_by' => $this->admin->id]);

    $this->actingAs($this->admin)
        ->get('/admin/pages')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/pages/index')
            ->has('pages', 3)
        );
});

test('editor can view pages list', function (): void {
    $this->actingAs($this->editor)
        ->get('/admin/pages')
        ->assertOk();
});

test('admin can view create page builder', function (): void {
    $this->actingAs($this->admin)
        ->get('/admin/pages/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/pages/create'));
});

test('admin can create a page', function (): void {
    $this->actingAs($this->admin)
        ->post('/admin/pages', [
            'title' => 'About Us',
            'slug' => 'about-us',
            'meta_title' => 'About Us | Acme',
            'meta_description' => 'Learn more about us.',
            'meta_keywords' => null,
            'sections' => [
                ['section_type' => 'hero', 'sort_order' => 0, 'props' => ['heading' => 'Hello']],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('pages', ['slug' => 'about-us', 'status' => 'draft']);
    $this->assertDatabaseHas('page_sections', ['section_type' => 'hero']);
});

test('editor can create a draft page', function (): void {
    $this->actingAs($this->editor)
        ->post('/admin/pages', [
            'title' => 'Editor Page',
            'slug' => 'editor-page',
            'sections' => [],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('pages', ['slug' => 'editor-page', 'status' => 'draft']);
});

test('slug must be unique', function (): void {
    Page::factory()->create([
        'slug' => 'existing-slug',
        'created_by' => $this->admin->id,
        'updated_by' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)
        ->post('/admin/pages', [
            'title' => 'Duplicate',
            'slug' => 'existing-slug',
            'sections' => [],
        ])
        ->assertSessionHasErrors('slug');
});

test('admin can update a page and sections are synced', function (): void {
    $page = Page::factory()->create([
        'created_by' => $this->admin->id,
        'updated_by' => $this->admin->id,
    ]);
    PageSection::create([
        'page_id' => $page->id,
        'section_type' => 'hero',
        'sort_order' => 0,
        'props' => ['heading' => 'Old'],
    ]);

    $this->actingAs($this->admin)
        ->put("/admin/pages/{$page->id}", [
            'title' => 'Updated Title',
            'slug' => $page->slug,
            'sections' => [
                ['section_type' => 'newsletter', 'sort_order' => 0, 'props' => ['heading' => 'Subscribe']],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('pages', ['id' => $page->id, 'title' => 'Updated Title']);
    // Old section removed, new one inserted
    $this->assertDatabaseMissing('page_sections', ['section_type' => 'hero', 'page_id' => $page->id]);
    $this->assertDatabaseHas('page_sections', ['section_type' => 'newsletter', 'page_id' => $page->id]);
});

test('admin can publish a page', function (): void {
    $page = Page::factory()->draft()->create([
        'created_by' => $this->admin->id,
        'updated_by' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)
        ->post("/admin/pages/{$page->id}/publish")
        ->assertRedirect();

    $this->assertDatabaseHas('pages', ['id' => $page->id, 'status' => 'published']);
});

test('editor cannot publish a page', function (): void {
    $page = Page::factory()->draft()->create([
        'created_by' => $this->editor->id,
        'updated_by' => $this->editor->id,
    ]);

    $this->actingAs($this->editor)
        ->post("/admin/pages/{$page->id}/publish")
        ->assertForbidden();
});

test('admin can delete a page', function (): void {
    $page = Page::factory()->create([
        'created_by' => $this->admin->id,
        'updated_by' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)
        ->delete("/admin/pages/{$page->id}")
        ->assertRedirect(route('admin.pages.index'));

    $this->assertDatabaseMissing('pages', ['id' => $page->id]);
});

test('admin can create a page with no_index', function (): void {
    $this->actingAs($this->admin)
        ->post('/admin/pages', [
            'title' => 'No Index Page',
            'slug' => 'no-index-page',
            'no_index' => true,
            'sections' => [],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('pages', [
        'slug' => 'no-index-page',
        'no_index' => true,
    ]);
});

test('admin can update a page no_index status', function (): void {
    $page = Page::factory()->create([
        'no_index' => false,
        'created_by' => $this->admin->id,
        'updated_by' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)
        ->put("/admin/pages/{$page->id}", [
            'title' => 'Updated Title',
            'slug' => $page->slug,
            'no_index' => true,
            'sections' => [],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('pages', [
        'id' => $page->id,
        'no_index' => true,
    ]);
});

test('page duplication preserves no_index status', function (): void {
    $page = Page::factory()->noIndex()->create([
        'created_by' => $this->admin->id,
        'updated_by' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)
        ->post("/admin/pages/{$page->id}/duplicate", [
            'title' => 'Duplicated Title',
            'slug' => 'duplicated-slug',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('pages', [
        'slug' => 'duplicated-slug',
        'no_index' => true,
    ]);
});
