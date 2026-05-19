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
        Schema::table('page_sections', function (Blueprint $table): void {
            $table->enum('region', ['header', 'body', 'footer'])->default('body')->after('page_id');
        });

        Schema::table('pages', function (Blueprint $table): void {
            $table->boolean('custom_header')->default(false)->after('published_at');
            $table->boolean('custom_footer')->default(false)->after('custom_header');
        });

        Schema::create('layout_sections', function (Blueprint $table): void {
            $table->id();
            $table->enum('region', ['header', 'footer']);
            $table->string('section_type');
            $table->integer('sort_order')->default(0);
            $table->json('props')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('layout_sections');

        Schema::table('pages', function (Blueprint $table): void {
            $table->dropColumn(['custom_header', 'custom_footer']);
        });

        Schema::table('page_sections', function (Blueprint $table): void {
            $table->dropColumn('region');
        });
    }
};
