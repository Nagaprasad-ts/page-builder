<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $admin = DB::table('users')->where('role', 'admin')->first() ?? DB::table('users')->first();

        if (! $admin) {
            return;
        }

        $page = DB::table('pages')->where('slug', '404')->first();

        if (! $page) {
            $pageId = DB::table('pages')->insertGetId([
                'title' => 'error.tsx',
                'slug' => '404',
                'meta_title' => 'Page Not Found',
                'meta_description' => 'Sorry, the page you are looking for could not be found.',
                'meta_keywords' => '404, not found, page not found',
                'status' => 'published',
                'published_at' => now(),
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $now = now();
            DB::table('page_sections')->insert([
                [
                    'page_id' => $pageId,
                    'region' => 'body',
                    'section_type' => 'error-404',
                    'sort_order' => 0,
                    'props' => json_encode((object) []),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $pageId,
                    'region' => 'body',
                    'section_type' => 'explore-services',
                    'sort_order' => 1,
                    'props' => json_encode((object) []),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'page_id' => $pageId,
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
        DB::table('pages')->where('slug', '404')->delete();
    }
};
