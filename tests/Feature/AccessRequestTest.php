<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

test('it validates that all access request form fields are required', function () {
    $this->postJson('/access-request/submit', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'name',
            'email',
            'phone',
            'designation',
            'company',
            'teamSize',
            'linkedin',
            'whatDescribesYou',
            'consent',
        ]);
});

test('it validates that generic free email domains are rejected', function () {
    $this->postJson('/access-request/submit', [
        'name' => 'Jane Doe',
        'email' => 'jane.doe@gmail.com', // Generic/free email
        'phone' => '9844038489',
        'designation' => 'HR Director / VP',
        'company' => 'EVP Headquarters',
        'teamSize' => '11 - 50',
        'linkedin' => 'https://linkedin.com/in/janedoe',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => true,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'email' => 'Please use a business/company email address (e.g., name@yourcompany.com).',
        ]);
});

test('it validates that the phone number must be exactly 10 digits', function () {
    $this->postJson('/access-request/submit', [
        'name' => 'Jane Doe',
        'email' => 'jane.doe@example.com',
        'phone' => '12345', // Under 10 digits
        'designation' => 'HR Director / VP',
        'company' => 'EVP Headquarters',
        'teamSize' => '11 - 50',
        'linkedin' => 'https://linkedin.com/in/janedoe',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => true,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['phone']);

    $this->postJson('/access-request/submit', [
        'name' => 'Jane Doe',
        'email' => 'jane.doe@example.com',
        'phone' => '12345678901', // Over 10 digits
        'designation' => 'HR Director / VP',
        'company' => 'EVP Headquarters',
        'teamSize' => '11 - 50',
        'linkedin' => 'https://linkedin.com/in/janedoe',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => true,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['phone']);

    $this->postJson('/access-request/submit', [
        'name' => 'Jane Doe',
        'email' => 'jane.doe@example.com',
        'phone' => 'abcdefghij', // Non-numeric
        'designation' => 'HR Director / VP',
        'company' => 'EVP Headquarters',
        'teamSize' => '11 - 50',
        'linkedin' => 'https://linkedin.com/in/janedoe',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => true,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['phone']);
});

test('it successfully creates a subscriber in Zoho CRM HR_Library_Subscribers via API', function () {
    // Set up standard configurations for testing
    config([
        'services.zoho_crm.client_id' => 'mock_client_id',
        'services.zoho_crm.client_secret' => 'mock_client_secret',
        'services.zoho_crm.refresh_token' => 'mock_refresh_token',
        'services.zoho_crm.region' => 'in',
    ]);

    // Clear access token cache to force refresh call
    Cache::forget('zoho_crm_access_token');

    // Fake Zoho OAuth token refresh and CRM Subscriber insertion requests
    Http::fake([
        'https://accounts.zoho.in/oauth/v2/token' => Http::response([
            'access_token' => 'mock_access_token',
            'expires_in' => 3600,
        ], 200),
        'https://www.zohoapis.in/crm/v3/HR_Library_Subscribers' => Http::response([
            'data' => [
                [
                    'code' => 'SUCCESS',
                    'details' => ['id' => '9876543210987'],
                    'message' => 'record added',
                    'status' => 'success',
                ],
            ],
        ], 201),
    ]);

    $this->postJson('/access-request/submit', [
        'name' => 'Jane Doe',
        'email' => 'jane.doe@example.com',
        'phone' => '9844038489',
        'designation' => 'HR Director / VP',
        'company' => 'EVP Headquarters',
        'teamSize' => '11 - 50',
        'linkedin' => 'https://linkedin.com/in/janedoe',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => true,
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Subscriber successfully submitted to Zoho CRM.',
        ]);

    // Assert correct OAuth token fetch request was sent
    Http::assertSent(function ($request) {
        return $request->url() === 'https://accounts.zoho.in/oauth/v2/token'
            && $request['client_id'] === 'mock_client_id'
            && $request['refresh_token'] === 'mock_refresh_token';
    });

    // Assert correct CRM HR_Library_Subscribers payload mapping
    Http::assertSent(function ($request) {
        if ($request->url() !== 'https://www.zohoapis.in/crm/v3/HR_Library_Subscribers') {
            return false;
        }

        $data = json_decode($request->body(), true);
        $subscriber = $data['data'][0] ?? [];

        return $subscriber['Name'] === 'Jane Doe'
            && $subscriber['Phone'] === '9844038489'
            && $subscriber['Work_Email'] === 'jane.doe@example.com'
            && $subscriber['LinkedIn_Profile'] === 'https://linkedin.com/in/janedoe'
            && $subscriber['Designation'] === 'HR Director / VP'
            && $subscriber['Company'] === 'EVP Headquarters'
            && $subscriber['Email_Opt_Out'] === false;
    });
});

test('it falls back gracefully to a mock subscriber result if credentials are not configured', function () {
    // Force config values to be empty
    config([
        'services.zoho_crm.client_id' => null,
        'services.zoho_crm.client_secret' => null,
        'services.zoho_crm.refresh_token' => null,
    ]);

    Http::fake();

    $this->postJson('/access-request/submit', [
        'name' => 'Alice Smith',
        'email' => 'alice@example.com',
        'phone' => '1234567890',
        'designation' => 'HR Manager',
        'company' => 'ACME Corp',
        'teamSize' => '51 - 200',
        'linkedin' => 'https://linkedin.com/in/alicesmith',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => false,
    ])
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Subscriber simulated successfully (credentials not configured).',
        ]);

    Http::assertNothingSent();
});

test('it returns 502 error if subscriber Zoho CRM OAuth token refresh fails', function () {
    config([
        'services.zoho_crm.client_id' => 'mock_client_id',
        'services.zoho_crm.client_secret' => 'mock_client_secret',
        'services.zoho_crm.refresh_token' => 'mock_refresh_token',
    ]);

    Cache::forget('zoho_crm_access_token');

    Http::fake([
        'https://accounts.zoho.in/oauth/v2/token' => Http::response('Unauthorized', 400),
    ]);

    $this->postJson('/access-request/submit', [
        'name' => 'Error User',
        'email' => 'error@example.com',
        'phone' => '0000000000',
        'designation' => 'Other',
        'company' => 'None',
        'teamSize' => '1 - 10',
        'linkedin' => 'https://linkedin.com/in/erroruser',
        'whatDescribesYou' => 'Other',
        'consent' => true,
    ])
        ->assertStatus(502)
        ->assertJson([
            'success' => false,
            'message' => 'Unable to authenticate with Zoho CRM. Please contact administration.',
        ]);
});

test('it returns 502 error if Zoho CRM HR_Library_Subscribers API returns a failure status code', function () {
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
        'https://www.zohoapis.in/crm/v3/HR_Library_Subscribers' => Http::response('Server Error', 500),
    ]);

    $this->postJson('/access-request/submit', [
        'name' => 'API Error User',
        'email' => 'api-error@example.com',
        'phone' => '0000000000',
        'designation' => 'CEO / Executive',
        'company' => 'Testing',
        'teamSize' => '1 - 10',
        'linkedin' => 'https://linkedin.com/in/apierror',
        'whatDescribesYou' => 'Other',
        'consent' => true,
    ])
        ->assertStatus(502)
        ->assertJson([
            'success' => false,
            'message' => 'Failed to create subscriber in Zoho CRM. Status: 500',
        ]);
});

test('it validates recaptcha_token when services config has a secret key', function () {
    config([
        'services.recaptcha.secret_key' => 'mock_secret_key',
    ]);

    Http::fake(function ($request) {
        if (str_contains($request->url(), 'recaptcha/api/siteverify')) {
            $responseToken = $request['response'] ?? '';
            if ($responseToken === 'valid_token') {
                return Http::response(['success' => true, 'score' => 0.9], 200);
            }
            return Http::response(['success' => false, 'score' => 0.1], 200);
        }
        return null;
    });

    // 1. Missing token should fail validation
    $this->postJson('/access-request/submit', [
        'name' => 'Jane Doe',
        'email' => 'jane.doe@example.com',
        'phone' => '1234567890',
        'designation' => 'HR Director / VP',
        'company' => 'EVP Headquarters',
        'teamSize' => '11 - 50',
        'linkedin' => 'https://linkedin.com/in/janedoe',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => true,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['recaptcha_token']);

    // 2. Invalid token or low score should fail validation
    $this->postJson('/access-request/submit', [
        'name' => 'Jane Doe',
        'email' => 'jane.doe@example.com',
        'phone' => '1234567890',
        'designation' => 'HR Director / VP',
        'company' => 'EVP Headquarters',
        'teamSize' => '11 - 50',
        'linkedin' => 'https://linkedin.com/in/janedoe',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => true,
        'recaptcha_token' => 'invalid_token',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['recaptcha_token']);

    // 3. Valid token with high score should pass validation
    // Note: We bypass Zoho CRM client calling by leaving credentials empty.
    config([
        'services.zoho_crm.client_id' => null,
        'services.zoho_crm.client_secret' => null,
        'services.zoho_crm.refresh_token' => null,
    ]);

    $this->postJson('/access-request/submit', [
        'name' => 'Jane Doe',
        'email' => 'jane.doe@example.com',
        'phone' => '1234567890',
        'designation' => 'HR Director / VP',
        'company' => 'EVP Headquarters',
        'teamSize' => '11 - 50',
        'linkedin' => 'https://linkedin.com/in/janedoe',
        'whatDescribesYou' => 'Corporate HR Leader',
        'consent' => true,
        'recaptcha_token' => 'valid_token',
    ])
        ->assertSuccessful();
});
