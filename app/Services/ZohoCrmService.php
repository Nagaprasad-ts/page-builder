<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZohoCrmService
{
    protected ?string $clientId;

    protected ?string $clientSecret;

    protected ?string $refreshToken;

    protected string $region;

    protected string $accountsUrl;

    protected string $apiBaseUrl;

    public function __construct()
    {
        $this->clientId = config('services.zoho_crm.client_id');
        $this->clientSecret = config('services.zoho_crm.client_secret');
        $this->refreshToken = config('services.zoho_crm.refresh_token');
        $this->region = config('services.zoho_crm.region', 'in');

        // Resolve domain URLs based on region (e.g. .in, .com, .eu)
        $this->accountsUrl = "https://accounts.zoho.{$this->region}/oauth/v2/token";
        $this->apiBaseUrl = "https://www.zohoapis.{$this->region}/crm/v3";
    }

    /**
     * Get or refresh the OAuth access token from cache or Zoho server.
     */
    public function getAccessToken(): ?string
    {
        $cacheKey = 'zoho_crm_access_token';

        // Check if token exists in cache
        if ($token = Cache::get($cacheKey)) {
            return $token;
        }

        if (empty($this->clientId) || empty($this->clientSecret) || empty($this->refreshToken)) {
            Log::warning('Zoho CRM Client: OAuth credentials are not fully configured.');

            return null;
        }

        try {
            $response = Http::asForm()->post($this->accountsUrl, [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'refresh_token' => $this->refreshToken,
                'grant_type' => 'refresh_token',
            ]);

            if ($response->failed()) {
                Log::error('Zoho CRM OAuth token refresh failed: '.$response->status().' - '.$response->body());

                return null;
            }

            $data = $response->json();

            if (empty($data['access_token'])) {
                Log::error('Zoho CRM OAuth response missing access token: '.json_encode($data));

                return null;
            }

            $token = $data['access_token'];
            // Cache token for slightly less than its expiry time (typically 3600 seconds)
            $expiresIn = $data['expires_in'] ?? 3600;
            Cache::put($cacheKey, $token, $expiresIn - 300);

            return $token;
        } catch (Exception $e) {
            Log::error('Zoho CRM OAuth token refresh exception: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Submit contact form lead details to Zoho CRM.
     */
    public function createLead(array $data): array
    {
        // Graceful mock fallback if credentials are not configured (useful for local development/testing)
        if (empty($this->clientId) || empty($this->clientSecret) || empty($this->refreshToken)) {
            Log::info("Zoho CRM Lead Integration (Mock Fallback): Lead created locally: Name: {$data['name']}, Email: {$data['email']}, Phone: {$data['phone']}, Designation: {$data['designation']}, Company: {$data['company']}");

            return [
                'success' => true,
                'message' => 'Lead simulated successfully (credentials not configured).',
            ];
        }

        $accessToken = $this->getAccessToken();

        if (empty($accessToken)) {
            return [
                'success' => false,
                'message' => 'Unable to authenticate with Zoho CRM. Please contact administration.',
            ];
        }

        // Build Zoho CRM Leads payload.
        // Full Name is mapped entirely to Last_Name (mandatory in CRM layout). First_Name is not used.
        $payload = [
            'data' => [
                [
                    'Last_Name' => $data['name'],
                    'Email' => $data['email'],
                    'Mobile' => $data['phone'],
                    'Designation' => $data['designation'],
                    'Company' => $data['company'],
                    'Website' => $data['website'] ?? '',
                    'Country' => $data['country'] ?? '',
                    'City' => $data['city'] ?? '',
                    'Description' => $data['description'] ?? '',
                    'Lead_Source' => 'Web Form',
                ],
            ],
        ];

        try {
            $url = "{$this->apiBaseUrl}/Leads";
            $response = Http::withHeaders([
                'Authorization' => "Zoho-oauthtoken {$accessToken}",
                'Content-Type' => 'application/json',
            ])->post($url, $payload);

            if ($response->failed()) {
                Log::error('Zoho CRM Leads API request failed: '.$response->status().' - '.$response->body());

                return [
                    'success' => false,
                    'message' => 'Failed to create lead in Zoho CRM. Status: '.$response->status(),
                ];
            }

            $resData = $response->json();
            $recordResult = $resData['data'][0] ?? null;

            if ($recordResult && ($recordResult['status'] === 'success')) {
                Log::info('Zoho CRM Lead successfully inserted: ID: '.($recordResult['details']['id'] ?? 'N/A').", Email: {$data['email']}");

                return [
                    'success' => true,
                    'message' => 'Lead successfully submitted to Zoho CRM.',
                ];
            }

            Log::error('Zoho CRM Leads insertion reported error: '.json_encode($resData));

            return [
                'success' => false,
                'message' => 'Zoho CRM API returned record insertion error.',
            ];
        } catch (Exception $e) {
            Log::error('Zoho CRM Leads API exception: '.$e->getMessage());

            return [
                'success' => false,
                'message' => 'An error occurred during Zoho CRM submission: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Submit subscription request to Zoho CRM custom module HR_Library_Subscribers (HR Library Subscribers).
     */
    public function createSubscriber(array $data): array
    {
        // Graceful mock fallback if credentials are not configured (useful for local development/testing)
        if (empty($this->clientId) || empty($this->clientSecret) || empty($this->refreshToken)) {
            Log::info("Zoho CRM Subscriber Integration (Mock Fallback): Subscriber created locally: Name: {$data['name']}, Email: {$data['email']}, Phone: {$data['phone']}, Designation: {$data['designation']}, Company: {$data['company']}");

            return [
                'success' => true,
                'message' => 'Subscriber simulated successfully (credentials not configured).',
            ];
        }

        $accessToken = $this->getAccessToken();

        if (empty($accessToken)) {
            return [
                'success' => false,
                'message' => 'Unable to authenticate with Zoho CRM. Please contact administration.',
            ];
        }

        // Build Zoho CRM HR_Library_Subscribers payload
        $payload = [
            'data' => [
                [
                    'Name' => $data['name'],
                    'Country_Code' => $data['countryCode'] ?? '',
                    'Phone' => $data['phone'],
                    'Work_Email' => $data['email'],
                    'LinkedIn_Profile' => $data['linkedin'],
                    'Designation' => $data['designation'],
                    'Company' => $data['company'],
                    'Country' => $data['country'] ?? '',
                    'City' => $data['city'] ?? '',
                    'What_Describes_You' => $data['whatDescribesYou'] ?? '',
                    'Email_Opt_Out' => ! ($data['consent'] ?? false),
                ],
            ],
        ];

        try {
            $url = "{$this->apiBaseUrl}/HR_Library_Subscribers";
            $response = Http::withHeaders([
                'Authorization' => "Zoho-oauthtoken {$accessToken}",
                'Content-Type' => 'application/json',
            ])->post($url, $payload);

            if ($response->failed()) {
                Log::error('Zoho CRM HR_Library_Subscribers API request failed: '.$response->status().' - '.$response->body());

                return [
                    'success' => false,
                    'message' => 'Failed to create subscriber in Zoho CRM. Status: '.$response->status(),
                ];
            }

            $resData = $response->json();
            $recordResult = $resData['data'][0] ?? null;

            if ($recordResult && ($recordResult['status'] === 'success')) {
                Log::info('Zoho CRM Subscriber successfully inserted: ID: '.($recordResult['details']['id'] ?? 'N/A').", Email: {$data['email']}");

                return [
                    'success' => true,
                    'message' => 'Subscriber successfully submitted to Zoho CRM.',
                ];
            }

            Log::error('Zoho CRM Subscriber insertion reported error: '.json_encode($resData));

            return [
                'success' => false,
                'message' => 'Zoho CRM API returned record insertion error.',
            ];
        } catch (Exception $e) {
            Log::error('Zoho CRM Subscriber API exception: '.$e->getMessage());

            return [
                'success' => false,
                'message' => 'An error occurred during Zoho CRM submission: '.$e->getMessage(),
            ];
        }
    }
}
