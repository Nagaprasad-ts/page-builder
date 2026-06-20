<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

test('it validates that email is required and must be valid', function () {
    $this->postJson('/newsletter/subscribe', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);

    $this->postJson('/newsletter/subscribe', ['email' => 'invalid-email'])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('it proxies subscription to Zoho Forms successfully', function () {
    Http::fake([
        'https://forms.zohopublic.in/*' => Http::response('Success page', 200),
    ]);

    $this->postJson('/newsletter/subscribe', [
        'email' => 'test@example.com',
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
        ]);

    Http::assertSent(function ($request) {
        return $request->url() === config('services.zoho.newsletter_url')
            && $request['Email'] === 'test@example.com';
    });
});

test('it handles Zoho Forms redirects as successful submissions', function () {
    Http::fake([
        'https://forms.zohopublic.in/myevphq/form/success' => Http::response('Success page', 200),
        'https://forms.zohopublic.in/*' => Http::response('Redirecting...', 302, [
            'Location' => 'https://forms.zohopublic.in/myevphq/form/success',
        ]),
    ]);

    $this->postJson('/newsletter/subscribe', [
        'email' => 'test-redirect@example.com',
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
        ]);
});

test('it returns 502 if Zoho Forms returns an error response', function () {
    Http::fake([
        'https://forms.zohopublic.in/*' => Http::response('Error', 500),
    ]);

    $this->postJson('/newsletter/subscribe', [
        'email' => 'test-error@example.com',
    ])
        ->assertStatus(502)
        ->assertJson([
            'success' => false,
        ]);
});

test('it handles proxy exceptions gracefully', function () {
    Http::fake(fn () => throw new Exception('Network Timeout'));

    $this->postJson('/newsletter/subscribe', [
        'email' => 'test-timeout@example.com',
    ])
        ->assertStatus(500)
        ->assertJson([
            'success' => false,
        ]);
});

test('it falls back gracefully if Zoho URL is not configured', function () {
    // Temporarily clear config
    config(['services.zoho.newsletter_url' => null]);

    Log::shouldReceive('warning')
        ->once();

    $this->postJson('/newsletter/subscribe', [
        'email' => 'test-local@example.com',
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Subscription logged locally (Zoho not configured).',
        ]);
});

test('it succeeds instantly without calling Zoho if email ends with @test.com or contains mock', function () {
    Http::fake();

    $this->postJson('/newsletter/subscribe', [
        'email' => 'user@test.com',
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Successfully subscribed (mock).',
        ]);

    $this->postJson('/newsletter/subscribe', [
        'email' => 'mock-user@gmail.com',
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Successfully subscribed (mock).',
        ]);

    Http::assertNothingSent();
});
