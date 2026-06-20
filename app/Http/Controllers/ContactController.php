<?php

namespace App\Http\Controllers;

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
            'phone' => ['required', 'string', 'max:50'],
            'designation' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ]);

        logger()->info('Contact Form Submission: Received request.', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'],
        ]);

        $result = $this->zohoCrm->createLead($validated);

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
