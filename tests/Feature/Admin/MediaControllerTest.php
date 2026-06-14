<?php

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('public');
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->editor = User::factory()->create(['role' => 'editor']);
});

test('admin can upload an image', function (): void {
    $file = UploadedFile::fake()->image('photo.jpg', 800, 600);

    $this->actingAs($this->admin)
        ->postJson('/admin/media', ['file' => $file])
        ->assertOk()
        ->assertJsonStructure(['id', 'filename', 'url', 'mime_type']);

    Storage::disk('public')->assertExists('media/photo.jpg');
    $this->assertDatabaseHas('media', ['original_name' => 'photo.jpg']);
});

test('editor can upload an image', function (): void {
    $file = UploadedFile::fake()->image('test.png', 400, 400);

    $this->actingAs($this->editor)
        ->postJson('/admin/media', ['file' => $file])
        ->assertOk();
});

test('non-image files are rejected', function (): void {
    $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $this->actingAs($this->admin)
        ->postJson('/admin/media', ['file' => $file])
        ->assertUnprocessable();
});

test('admin can delete media', function (): void {
    $media = Media::factory()->create(['uploaded_by' => $this->admin->id]);

    Storage::disk('public')->put($media->path, 'fake-image-data');

    $this->actingAs($this->admin)
        ->deleteJson("/admin/media/{$media->id}")
        ->assertOk()
        ->assertJson(['success' => true]);

    $this->assertDatabaseMissing('media', ['id' => $media->id]);
    Storage::disk('public')->assertMissing($media->path);
});

test('unauthenticated user cannot access media endpoints', function (): void {
    $this->get('/admin/media')->assertRedirect();
});
