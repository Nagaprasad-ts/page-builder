<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Return a paginated list of media items as JSON.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'media' => Media::latest()->paginate(40),
        ]);
    }

    /**
     * Upload a new media file.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'image', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->store('media', 'public');

        /** @var Media $media */
        $media = Media::create([
            'filename' => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'disk' => 'public',
            'mime_type' => $file->getMimeType() ?? 'image/jpeg',
            'size' => $file->getSize(),
            'alt' => null,
            'uploaded_by' => auth()->id(),
        ]);

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
