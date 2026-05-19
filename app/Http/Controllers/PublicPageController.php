<?php

namespace App\Http\Controllers;

use App\Models\LayoutSection;
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

        $globalHeader = LayoutSection::where('region', 'header')->orderBy('sort_order')->get();
        $globalFooter = LayoutSection::where('region', 'footer')->orderBy('sort_order')->get();

        $bodySections = $page->sections->where('region', 'body')->values();
        $headerSections = $page->custom_header
            ? $page->sections->where('region', 'header')->values()
            : $globalHeader;
        $footerSections = $page->custom_footer
            ? $page->sections->where('region', 'footer')->values()
            : $globalFooter;

        return Inertia::render('site/page', [
            'page' => $page,
            'headerSections' => $headerSections,
            'bodySections' => $bodySections,
            'footerSections' => $footerSections,
        ]);
    }
}
