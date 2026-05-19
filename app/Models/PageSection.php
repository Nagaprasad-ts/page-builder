<?php

namespace App\Models;

use Database\Factories\PageSectionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['page_id', 'region', 'section_type', 'sort_order', 'props'])]
class PageSection extends Model
{
    /** @use HasFactory<PageSectionFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'props' => 'array',
            'sort_order' => 'integer',
        ];
    }

    /**
     * The page this section belongs to.
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
