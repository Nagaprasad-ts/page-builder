<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class RobotsController extends Controller
{
    /**
     * Generate the robots.txt dynamically and cache the output.
     */
    public function index(): Response
    {
        $content = Cache::rememberForever('robots_txt', function () {
            $rules = [
                'User-agent: *',
                'Disallow: /admin/',
                'Disallow: /settings/',
                'Disallow: /dashboard',
                'Disallow: /login',
                'Disallow: /register',
                'Disallow: /forgot-password',
                'Disallow: /reset-password',
                'Disallow: /two-factor-challenge',
                'Disallow: /draft/',
            ];

            // Fetch published pages with no_index enabled
            $noIndexPages = Page::published()
                ->where('no_index', true)
                ->orderBy('path')
                ->get();

            foreach ($noIndexPages as $page) {
                $path = $page->path;
                if ($path === '/' || $path === 'home') {
                    $rules[] = 'Disallow: /';
                } else {
                    $rules[] = 'Disallow: /'.ltrim($path, '/');
                }
            }

            // Append dynamic sitemap URL
            $rules[] = '';
            $rules[] = 'Sitemap: '.url('sitemap.xml');

            return implode("\n", $rules)."\n";
        });

        return response($content)->header('Content-Type', 'text/plain');
    }
}
