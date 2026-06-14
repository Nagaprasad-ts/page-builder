<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * List all pages.
     */
    public function index(): Response
    {
        return Inertia::render('admin/pages/index', [
            'pages' => Page::with('creator:id,name')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Show the page builder for a new page.
     */
    public function create(): Response
    {
        return Inertia::render('admin/pages/create', [
            'pages' => Page::select(['id', 'title', 'path', 'parent_id'])->get(),
        ]);
    }

    /**
     * Store a newly created page.
     */
    public function store(StorePageRequest $request): RedirectResponse
    {
        $page = DB::transaction(function () use ($request): Page {
            /** @var Page $page */
            $page = Page::create([
                ...$request->safe()->except('sections'),
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            $this->syncSections($page, $request->input('sections', []));

            return $page;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Page created.']);

        return to_route('admin.pages.edit', $page);
    }

    /**
     * Show the page builder for an existing page.
     */
    public function edit(Page $page): Response
    {
        $pages = Page::where('id', '!=', $page->id)
            ->select(['id', 'title', 'path', 'parent_id'])
            ->get()
            ->filter(fn ($p) => !$p->isDescendantOf($page))
            ->values();

        return Inertia::render('admin/pages/edit', [
            'page' => $page,
            'sections' => $page->sections,
            'pages' => $pages,
        ]);
    }

    /**
     * Update an existing page.
     */
    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        DB::transaction(function () use ($request, $page): void {
            $page->fill([
                ...$request->safe()->except('sections'),
                'updated_by' => auth()->id(),
            ])->save();

            $this->syncSections($page, $request->input('sections', []));
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Page saved.']);

        return back();
    }

    /**
     * Delete a page.
     */
    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Page deleted.']);

        return to_route('admin.pages.index');
    }

    /**
     * Duplicate a page with a new title and slug.
     */
    public function duplicate(Request $request, Page $page): RedirectResponse
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug'  => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($page) {
                    $parentId = $page->parent_id;
                    $parent = $parentId ? Page::find($parentId) : null;
                    $newPath = $parent ? $parent->path . '/' . $value : $value;
                    if (Page::where('path', $newPath)->exists()) {
                        $fail('The slug is already taken under this parent.');
                    }
                }
            ],
        ]);

        $newPage = DB::transaction(function () use ($request, $page): Page {
            $created = $page->replicate(['published_at']);
            $created->title      = $request->input('title');
            $created->slug       = $request->input('slug');
            $created->status     = 'draft';
            $created->created_by = auth()->id();
            $created->updated_by = auth()->id();
            $created->save();

            $now = now();
            $sections = $page->sections()->get()->map(fn ($s) => [
                'page_id'      => $created->id,
                'region'       => $s->region,
                'section_type' => $s->section_type,
                'sort_order'   => $s->sort_order,
                'props'        => json_encode($s->props ?? []),
                'created_at'   => $now,
                'updated_at'   => $now,
            ])->all();

            if (! empty($sections)) {
                PageSection::insert($sections);
            }

            return $created;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Page duplicated.']);

        return to_route('admin.pages.edit', $newPage);
    }

    /**
     * Publish a page (admin only).
     */
    public function publish(Page $page): RedirectResponse
    {
        $page->update([
            'status' => 'published',
            'published_at' => now(),
            'updated_by' => auth()->id(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Page published.']);

        return back();
    }

    /**
     * Revert a page to draft (admin only).
     */
    public function unpublish(Page $page): RedirectResponse
    {
        $page->update([
            'status' => 'draft',
            'published_at' => null,
            'updated_by' => auth()->id(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Page reverted to draft.']);

        return back();
    }

    /**
     * Delete all existing sections and bulk-insert the new set.
     *
     * @param  array<int, array{section_type: string, sort_order: int, region: string, props: array<string, mixed>}>  $sections
     */
    private function syncSections(Page $page, array $sections): void
    {
        $page->sections()->delete();

        if (empty($sections)) {
            return;
        }

        $now = now();
        $rows = array_map(fn (array $section): array => [
            'page_id' => $page->id,
            'region' => $section['region'] ?? 'body',
            'section_type' => $section['section_type'],
            'sort_order' => $section['sort_order'],
            'props' => json_encode($section['props'] ?? []),
            'created_at' => $now,
            'updated_at' => $now,
        ], $sections);

        PageSection::insert($rows);
    }
}
