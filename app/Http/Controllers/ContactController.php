<?php

namespace App\Http\Controllers;

use App\Rules\Recaptcha;
use App\Services\ZohoCrmService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    protected ZohoCrmService $zohoCrm;

    public function __construct(ZohoCrmService $zohoCrm)
    {
        $this->zohoCrm = $zohoCrm;
    }

    /**
     * Handle incoming contact form submissions and submit them to Zoho CRM.
     */
    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'designation' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'recaptcha_token' => [
                empty(config('services.recaptcha.secret_key')) ? 'nullable' : 'required',
                new Recaptcha,
            ],
        ]);

        logger()->info('Contact Form Submission: Received request.', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'],
        ]);

        // Phone arrives as "+91 <digits>"; split for Zoho (Mobile field max 12 chars)
        [$countryCode, $phoneDigits] = array_pad(explode(' ', $validated['phone'], 2), 2, '');
        $zohoData = array_merge($validated, [
            'phone' => trim($phoneDigits),
            'country' => 'India',
        ]);

        $result = $this->zohoCrm->createLead($zohoData);

        if ($result['success']) {
            logger()->info('Contact Form Submission: Success.', [
                'email' => $validated['email'],
                'message' => $result['message'],
            ]);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
            ]);
        }

        logger()->error('Contact Form Submission: Failed.', [
            'email' => $validated['email'],
            'message' => $result['message'],
        ]);

        return response()->json([
            'success' => false,
            'message' => $result['message'],
        ], 502);
    }
}
