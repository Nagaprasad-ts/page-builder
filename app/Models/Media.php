<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['filename', 'original_name', 'path', 'disk', 'mime_type', 'size', 'alt', 'uploaded_by'])]
class Media extends Model
{
    /** @use HasFactory<\Database\Factories\MediaFactory> */
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = ['url'];

    /**
     * Get the public URL for this media item.
     * Forces HTTPS when the app is served over HTTPS (e.g. via Herd secure).
     */
    public function getUrlAttribute(): string
    {
        $url = Storage::disk($this->disk)->url($this->path);

        if (request()->isSecure()) {
            $url = preg_replace('/^http:\/\//', 'https://', $url);
        }

        return $url;
    }

    /**
     * The user who uploaded this media.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
