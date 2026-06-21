<?php

namespace App\Http\Controllers;

use App\Services\ZohoCrmService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccessRequestController extends Controller
{
    protected ZohoCrmService $zohoCrm;

    public function __construct(ZohoCrmService $zohoCrm)
    {
        $this->zohoCrm = $zohoCrm;
    }

    /**
     * Handle incoming access request submissions and submit them to Zoho CRM.
     */
    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    $freeDomains = [
                        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
                        'aol.com', 'icloud.com', 'zoho.com', 'yandex.com', 'mail.com',
                        'gmx.com', 'protonmail.com', 'proton.me', 'fastmail.com', 'hushmail.com',
                        'rediffmail.com',
                    ];

                    $domain = strtolower(substr(strrchr($value, '@'), 1));

                    if (in_array($domain, $freeDomains)) {
                        $fail('Please use a business/company email address (e.g., name@yourcompany.com).');
                    }
                },
            ],
            'phone' => ['required', 'digits:10'],
            'designation' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'teamSize' => ['required', 'string', 'max:255'],
            'linkedin' => ['required', 'url', 'max:255'],
            'whatDescribesYou' => ['required', 'string', 'max:255'],
            'consent' => ['required', 'boolean'],
            'recaptcha_token' => [
                empty(config('services.recaptcha.secret_key')) ? 'nullable' : 'required',
                new \App\Rules\Recaptcha
            ],
        ]);

        logger()->info('Access Request Submission: Received request.', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'],
        ]);

        $result = $this->zohoCrm->createSubscriber($validated);

        if ($result['success']) {
            logger()->info('Access Request Submission: Success.', [
                'email' => $validated['email'],
                'message' => $result['message'],
            ]);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
            ]);
        }

        logger()->error('Access Request Submission: Failed.', [
            'email' => $validated['email'],
            'message' => $result['message'],
        ]);

        return response()->json([
            'success' => false,
            'message' => $result['message'],
        ], 502);
    }
}
