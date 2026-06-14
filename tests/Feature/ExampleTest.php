<?php

use App\Models\Page;
use App\Models\User;

test('returns a successful response', function () {
    $user = User::factory()->create();
    Page::factory()->published()->create([
        'slug' => '/',
        'created_by' => $user->id,
        'updated_by' => $user->id,
    ]);

    $response = $this->get(route('home'));

    $response->assertOk();
});
