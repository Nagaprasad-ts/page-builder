<?php

namespace App\Http\Controllers;

use App\Rules\Recaptcha;
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
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'linkedin' => ['required', 'url', 'max:255'],
            'designation' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'whatDescribesYou' => ['required', 'string', 'max:255'],
            'consent' => ['required', 'boolean'],
            'recaptcha_token' => [
                empty(config('services.recaptcha.secret_key')) ? 'nullable' : 'required',
                new Recaptcha,
            ],
        ]);

        logger()->info('Access Request Submission: Received request.', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'],
        ]);

        // Phone is stored as "+91 8197099618"; split into code and digits for Zoho (Phone field max 12 chars)
        [$countryCode, $phoneDigits] = array_pad(explode(' ', $validated['phone'], 2), 2, '');
        $zohoData = array_merge($validated, [
            'phone' => trim($phoneDigits),
            'countryCode' => $countryCode,
        ]);

        $result = $this->zohoCrm->createSubscriber($zohoData);

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
