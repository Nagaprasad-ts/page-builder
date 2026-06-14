<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('id')->constrained('pages')->nullOnDelete();
            $table->string('path')->nullable()->after('slug');
        });

        // Backfill path with slug for all existing pages
        \Illuminate\Support\Facades\DB::table('pages')->update([
            'path' => \Illuminate\Support\Facades\DB::raw('slug')
        ]);

        Schema::table('pages', function (Blueprint $table) {
            // Drop unique constraint on slug
            $table->dropUnique(['slug']);
            // Make path unique and non-nullable
            $table->string('path')->nullable(false)->change();
            $table->unique('path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropUnique(['path']);
            $table->unique('slug');
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'path']);
        });
    }
};
