<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    /**
     * Serve a published page at its slug.
     */
    public function show(string $slug): Response
    {
        $page = Page::where('slug', $slug)
            ->where('status', 'published')
            ->with('sections')
            ->firstOrFail();

        return Inertia::render('site/page', [
            'page' => $page,
            'sections' => $page->sections,
        ]);
    }
}
