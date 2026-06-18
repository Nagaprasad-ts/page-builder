<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /**
     * Generate the sitemap dynamically and cache the output.
     */
    public function index(): Response
    {
        $xml = Cache::rememberForever('sitemap', function () {
            $pages = Page::published()
                ->where('slug', '!=', '404')
                ->where('path', '!=', '404')
                ->orderBy('created_at')
                ->get();

            $output = '<?xml version="1.0" encoding="UTF-8"?>';
            $output .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

            foreach ($pages as $page) {
                // Determine absolute URL (home or first page maps to root url)
                $loc = ($page->path === '/' || $page->path === 'home')
                    ? url('/')
                    : url($page->path);

                // Use published_at as fallback if not null, otherwise updated_at
                $lastmod = ($page->published_at ?? $page->updated_at)->toAtomString();
                $changefreq = ($page->path === '/' || $page->path === 'home') ? 'daily' : 'weekly';
                $priority = ($page->path === '/' || $page->path === 'home') ? '1.0' : '0.8';

                $output .= '<url>';
                $output .= "<loc>{$loc}</loc>";
                $output .= "<lastmod>{$lastmod}</lastmod>";
                $output .= "<changefreq>{$changefreq}</changefreq>";
                $output .= "<priority>{$priority}</priority>";
                $output .= '</url>';
            }

            $output .= '</urlset>';

            return $output;
        });

        return response($xml)->header('Content-Type', 'text/xml');
    }
}
