<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    /**
     * Return the media library — Inertia page for browser visits, JSON for fetch requests.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $media = Media::latest()->paginate(40);

        if ($request->wantsJson()) {
            return response()->json(['media' => $media]);
        }

        return Inertia::render('admin/media/index', [
            'media' => $media,
        ]);
    }

    /**
     * Upload a new media file, preserving the original filename.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimetypes:image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,image/svg+xml,image/avif,image/heic,image/heif,image/x-png', 'max:10240'],
            'alt' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $baseName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME));

        // Build a unique filename without changing the original name
        $filename = $baseName.'.'.$extension;
        $path = 'media/'.$filename;
        $counter = 1;

        while (Storage::disk('public')->exists($path)) {
            $filename = $baseName.'-'.$counter.'.'.$extension;
            $path = 'media/'.$filename;
            $counter++;
        }

        Storage::disk('public')->putFileAs('media', $file, $filename);

        /** @var Media $media */
        $media = Media::create([
            'filename' => $filename,
            'original_name' => $originalName,
            'path' => $path,
            'disk' => 'public',
            'mime_type' => $file->getMimeType() ?? 'image/jpeg',
            'size' => $file->getSize(),
            'alt' => $request->input('alt'),
            'uploaded_by' => auth()->id(),
        ]);

        return response()->json($media->fresh());
    }

    /**
     * Update alt text (and optionally original_name) for a media item.
     */
    public function update(Request $request, Media $media): JsonResponse
    {
        $request->validate([
            'alt' => ['nullable', 'string', 'max:255'],
            'original_name' => ['nullable', 'string', 'max:255'],
        ]);

        $media->update($request->only('alt', 'original_name'));

        return response()->json($media->fresh());
    }

    /**
     * Delete a media item and its underlying file.
     */
    public function destroy(Media $media): JsonResponse
    {
        Storage::disk($media->disk)->delete($media->path);
        $media->delete();

        return response()->json(['success' => true]);
    }
}
