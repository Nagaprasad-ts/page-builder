<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = fake()->uuid().'.jpg';

        return [
            'filename' => $filename,
            'original_name' => fake()->word().'.jpg',
            'path' => 'media/'.$filename,
            'disk' => 'public',
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(10000, 5000000),
            'alt' => fake()->sentence(4),
            'uploaded_by' => User::factory(),
        ];
    }
}
