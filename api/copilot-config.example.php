<?php
/**
 * Copy this file to copilot-config.local.php (same folder) and fill in ONE provider.
 * Never commit copilot-config.local.php — it holds your secret API key.
 *
 * Google Gemini (free tier): https://aistudio.google.com/apikey
 * Groq (free tier, fast): https://console.groq.com/keys
 *
 * Set provider to "gemini" or "groq" and paste the matching key.
 */
return [
    'provider' => 'gemini',
    'gemini_api_key' => '',
    /**
     * Use a current model id (1.5-flash is removed from API). Try flash-lite first for cost/quota.
     * https://ai.google.dev/gemini-api/docs/models
     */
    'gemini_model' => 'gemini-2.5-flash-lite',
    'groq_api_key' => '',
    'groq_model' => 'llama-3.3-70b-versatile',
];
