<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class Recaptcha implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $secret = config('services.recaptcha.secret_key');

        // Bypass verification if recaptcha secret is not set (useful for local development testing when key is empty)
        if (empty($secret)) {
            return;
        }

        if (empty($value)) {
            $fail('ReCAPTCHA verification failed.');
            return;
        }

        try {
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secret,
                'response' => $value,
            ]);

            if (!$response->successful() || !$response->json('success') || $response->json('score') < 0.5) {
                $fail('ReCAPTCHA verification failed. Please try again.');
            }
        } catch (\Exception $e) {
            logger()->error('ReCAPTCHA validation request failed: ' . $e->getMessage());
            $fail('ReCAPTCHA verification failed due to a server error. Please try again.');
        }
    }
}
