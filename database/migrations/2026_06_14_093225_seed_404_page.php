<?php

use App\Models\Page;
use App\Models\PageSection;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::first();

        if (! $admin) {
            return;
        }

        $page = Page::where('slug', '404')->first();

        if (! $page) {
            $page = Page::create([
                'title' => 'error.tsx',
                'slug' => '404',
                'meta_title' => 'Page Not Found',
                'meta_description' => 'Sorry, the page you are looking for could not be found.',
                'meta_keywords' => '404, not found, page not found',
                'status' => 'published',
                'published_at' => now(),
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);

            $now = now();
            PageSection::insert([
                [
                    'page_id' => $page->id,
                    'region' => 'body',
                    'section_type' => 'error-404',
                    'sort_order' => 0,
                    'props' => json_encode((object) []),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $page->id,
                    'region' => 'body',
                    'section_type' => 'explore-services',
                    'sort_order' => 1,
                    'props' => json_encode((object) []),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $page->id,
                    'region' => 'body',
                    'section_type' => 'help-cta',
                    'sort_order' => 2,
                    'props' => json_encode((object) []),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Page::where('slug', '404')->delete();
    }
};
