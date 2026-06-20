<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

test('it validates that all contact form fields are required', function () {
    $this->postJson('/contact/submit', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'name',
            'email',
            'phone',
            'designation',
            'company',
            'description',
        ]);
});

test('it successfully creates a lead in Zoho CRM via API', function () {
    // Set up standard configurations for testing
    config([
        'services.zoho_crm.client_id' => 'mock_client_id',
        'services.zoho_crm.client_secret' => 'mock_client_secret',
        'services.zoho_crm.refresh_token' => 'mock_refresh_token',
        'services.zoho_crm.region' => 'in',
    ]);

    // Clear access token cache to force refresh call
    Cache::forget('zoho_crm_access_token');

    // Fake Zoho OAuth token refresh and CRM Lead insertion requests
    Http::fake([
        'https://accounts.zoho.in/oauth/v2/token' => Http::response([
            'access_token' => 'mock_access_token',
            'expires_in' => 3600,
        ], 200),
        'https://www.zohoapis.in/crm/v3/Leads' => Http::response([
            'data' => [
                [
                    'code' => 'SUCCESS',
                    'details' => ['id' => '1234567890123'],
                    'message' => 'record added',
                    'status' => 'success',
                ],
            ],
        ], 201),
    ]);

    $this->postJson('/contact/submit', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '9844038489',
        'designation' => 'Executive',
        'company' => 'EVP Headquarters',
        'description' => 'We need help with branding.',
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Lead successfully submitted to Zoho CRM.',
        ]);

    // Assert correct OAuth token fetch request was sent
    Http::assertSent(function ($request) {
        return $request->url() === 'https://accounts.zoho.in/oauth/v2/token'
            && $request['client_id'] === 'mock_client_id'
            && $request['refresh_token'] === 'mock_refresh_token';
    });

    // Assert correct CRM Leads payload mapping (Name mapped to Last_Name, no First_Name used)
    Http::assertSent(function ($request) {
        if ($request->url() !== 'https://www.zohoapis.in/crm/v3/Leads') {
            return false;
        }

        $data = json_decode($request->body(), true);
        $lead = $data['data'][0] ?? [];

        return $lead['Last_Name'] === 'John Doe'
            && $lead['Email'] === 'john@example.com'
            && $lead['Mobile'] === '9844038489'
            && $lead['Designation'] === 'Executive'
            && $lead['Company'] === 'EVP Headquarters'
            && $lead['Description'] === 'We need help with branding.'
            && ! isset($lead['First_Name']);
    });
});

test('it falls back gracefully to a mock result if credentials are not configured', function () {
    // Force config values to be empty
    config([
        'services.zoho_crm.client_id' => null,
        'services.zoho_crm.client_secret' => null,
        'services.zoho_crm.refresh_token' => null,
    ]);

    Http::fake();

    $this->postJson('/contact/submit', [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'phone' => '1234567890',
        'designation' => 'Manager',
        'company' => 'ACME Corp',
        'description' => 'General inquiry.',
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Lead simulated successfully (credentials not configured).',
        ]);

    Http::assertNothingSent();
});

test('it returns 502 error if Zoho CRM OAuth token refresh fails', function () {
    config([
        'services.zoho_crm.client_id' => 'mock_client_id',
        'services.zoho_crm.client_secret' => 'mock_client_secret',
        'services.zoho_crm.refresh_token' => 'mock_refresh_token',
    ]);

    Cache::forget('zoho_crm_access_token');

    Http::fake([
        'https://accounts.zoho.in/oauth/v2/token' => Http::response('Unauthorized', 400),
    ]);

    $this->postJson('/contact/submit', [
        'name' => 'Error User',
        'email' => 'error@example.com',
        'phone' => '0000000000',
        'designation' => 'None',
        'company' => 'None',
        'description' => 'Test error handling.',
    ])
        ->assertStatus(502)
        ->assertJson([
            'success' => false,
            'message' => 'Unable to authenticate with Zoho CRM. Please contact administration.',
        ]);
});

test('it returns 502 error if Zoho CRM Leads API returns a failure status code', function () {
    config([
        'services.zoho_crm.client_id' => 'mock_client_id',
        'services.zoho_crm.client_secret' => 'mock_client_secret',
        'services.zoho_crm.refresh_token' => 'mock_refresh_token',
    ]);

    Cache::forget('zoho_crm_access_token');

    Http::fake([
        'https://accounts.zoho.in/oauth/v2/token' => Http::response([
            'access_token' => 'mock_access_token',
        ], 200),
        'https://www.zohoapis.in/crm/v3/Leads' => Http::response('Server Error', 500),
    ]);

    $this->postJson('/contact/submit', [
        'name' => 'API Error User',
        'email' => 'api-error@example.com',
        'phone' => '0000000000',
        'designation' => 'Tester',
        'company' => 'Testing',
        'description' => 'Test API failure.',
    ])
        ->assertStatus(502)
        ->assertJson([
            'success' => false,
            'message' => 'Failed to create lead in Zoho CRM. Status: 500',
        ]);
});
