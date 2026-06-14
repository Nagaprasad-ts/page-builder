<?php

use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\LayoutSection;
use App\Models\Page;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function (): void {
            Route::middleware('web')
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['sidebar_state']);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function ($response, $exception, $request) {
            if ($response->getStatusCode() === 404 && ! $request->expectsJson()) {
                $page = Page::where('slug', '404')->with('sections')->first();

                if ($page && $page->status === 'published') {
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
                    ])
                        ->toResponse($request)
                        ->setStatusCode(404);
                }

                $globalHeader = LayoutSection::where('region', 'header')->orderBy('sort_order')->get();
                $globalFooter = LayoutSection::where('region', 'footer')->orderBy('sort_order')->get();

                return Inertia::render('site/error', [
                    'status' => 404,
                    'headerSections' => $globalHeader,
                    'footerSections' => $globalFooter,
                ])
                    ->toResponse($request)
                    ->setStatusCode(404);
            }

            return $response;
        });
    })
    ->create();
