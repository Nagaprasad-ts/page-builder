<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LayoutSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GlobalLayoutController extends Controller
{
    /**
     * Show the global layout editor.
     */
    public function edit(): Response
    {
        return Inertia::render('admin/layout/edit', [
            'headerSections' => LayoutSection::where('region', 'header')->orderBy('sort_order')->get(),
            'footerSections' => LayoutSection::where('region', 'footer')->orderBy('sort_order')->get(),
        ]);
    }

    /**
     * Save the global layout sections.
     *
     * @param  array<int, array{section_type: string, sort_order: int, props: array<string, mixed>}>  $sections
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'header_sections' => ['nullable', 'array'],
            'header_sections.*.section_type' => ['required', 'string'],
            'header_sections.*.sort_order' => ['required', 'integer', 'min:0'],
            'header_sections.*.props' => ['nullable', 'array'],
            'footer_sections' => ['nullable', 'array'],
            'footer_sections.*.section_type' => ['required', 'string'],
            'footer_sections.*.sort_order' => ['required', 'integer', 'min:0'],
            'footer_sections.*.props' => ['nullable', 'array'],
        ]);

        $now = now();

        foreach (['header' => 'header_sections', 'footer' => 'footer_sections'] as $region => $key) {
            LayoutSection::where('region', $region)->delete();

            $sections = $request->input($key, []);

            if (empty($sections)) {
                continue;
            }

            $rows = array_map(fn (array $section): array => [
                'region' => $region,
                'section_type' => $section['section_type'],
                'sort_order' => $section['sort_order'],
                'props' => json_encode($section['props'] ?? []),
                'created_at' => $now,
                'updated_at' => $now,
            ], $sections);

            LayoutSection::insert($rows);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Global layout saved.']);

        return back();
    }
}
