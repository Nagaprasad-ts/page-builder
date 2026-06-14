<?php

namespace App\Http\Controllers;

use App\Models\LayoutSection;
use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    /**
     * Serve the homepage — looks for a published page with slug "home",
     * then falls back to the first published page, then 404.
     */
    public function home(): Response
    {
        $page = Page::where('status', 'published')
            ->with('sections')
            ->orderByRaw("CASE WHEN path = '/' THEN 0 WHEN path = 'home' THEN 1 ELSE 2 END")
            ->orderBy('created_at')
            ->firstOrFail();

        return $this->render($page);
    }

    /**
     * Serve a published page at its slug.
     */
    public function show(string $slug): Response
    {
        $page = Page::where('path', $slug)
            ->where('status', 'published')
            ->with('sections')
            ->firstOrFail();

        return $this->render($page);
    }

    /**
     * Preview any page (draft or published) — auth-only.
     */
    public function preview(string $slug): Response
    {
        $page = Page::where('path', $slug)
            ->with('sections')
            ->firstOrFail();

        return $this->render($page);
    }

    private function render(Page $page): Response
    {
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
            'breadcrumbs' => $page->getBreadcrumbs(),
            'headerSections' => $headerSections,
            'bodySections' => $bodySections,
            'footerSections' => $footerSections,
        ]);
    }
}
