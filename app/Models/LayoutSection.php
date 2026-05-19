<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['region', 'section_type', 'sort_order', 'props'])]
class LayoutSection extends Model
{
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
}
