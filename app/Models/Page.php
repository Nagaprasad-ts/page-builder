<?php

namespace App\Models;

use Database\Factories\PageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'slug', 'meta_title', 'meta_description', 'meta_keywords', 'status', 'published_at', 'custom_header', 'custom_footer', 'parent_id', 'path', 'created_by', 'updated_by'])]
class Page extends Model
{
    /** @use HasFactory<PageFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'custom_header' => 'boolean',
            'custom_footer' => 'boolean',
        ];
    }

    /**
     * Sections ordered by sort_order.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }

    /**
     * The parent page of this page.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'parent_id');
    }

    /**
     * The child pages of this page.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Page::class, 'parent_id');
    }

    /**
     * Build the dynamic absolute URL path of this page.
     */
    public function buildPath(): string
    {
        if (! $this->parent_id) {
            return $this->slug;
        }

        $parent = $this->parent;
        if (! $parent) {
            $parent = self::find($this->parent_id);
        }

        if ($parent) {
            $parentPath = $parent->buildPath();
            return ($parentPath === '/' ? '' : $parentPath) . '/' . $this->slug;
        }

        return $this->slug;
    }

    /**
     * Get the breadcrumbs list for this page.
     */
    public function getBreadcrumbs(): array
    {
        $breadcrumbs = [];
        $current = $this;

        while ($current) {
            $breadcrumbs[] = [
                'title' => $current->title,
                'url' => $current->path === '/' || $current->path === 'home' ? '/' : '/' . ltrim($current->path, '/'),
            ];
            $current = $current->parent;
        }

        $breadcrumbs = array_reverse($breadcrumbs);

        // Prepend Home if it exists and isn't already the first item
        $hasHome = self::where('path', '/')->orWhere('path', 'home')->exists();
        if ($hasHome && (! isset($breadcrumbs[0]) || ($breadcrumbs[0]['url'] !== '/'))) {
            array_unshift($breadcrumbs, [
                'title' => 'Home',
                'url' => '/',
            ]);
        }

        return $breadcrumbs;
    }

    /**
     * Check if this page is a descendant of the given page.
     */
    public function isDescendantOf(Page $page): bool
    {
        $parent = $this->parent;
        while ($parent) {
            if ($parent->id === $page->id) {
                return true;
            }
            $parent = $parent->parent;
        }
        return false;
    }

    /**
     * The user who created this page.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * The user who last updated this page.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope to only published pages.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function (Page $page) {
            if ($page->parent_id && $page->parent_id === $page->id) {
                throw new \InvalidArgumentException('A page cannot be its own parent.');
            }

            if ($page->parent_id) {
                $targetParent = self::find($page->parent_id);
                if ($targetParent && $targetParent->isDescendantOf($page)) {
                    throw new \InvalidArgumentException('Circular relationship detected.');
                }
            }

            $page->path = $page->buildPath();
        });

        static::updated(function (Page $page) {
            if ($page->wasChanged(['slug', 'parent_id', 'path'])) {
                foreach ($page->children as $child) {
                    $child->save(); // Triggers saving hook recursively
                }
            }
        });
    }
}
