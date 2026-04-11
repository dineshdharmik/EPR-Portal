<?php
header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/copilot-config.local.php';
$configured = false;
$provider = null;

if (is_readable($configPath)) {
    $c = require $configPath;
    $p = isset($c['provider']) ? strtolower((string) $c['provider']) : 'gemini';
    if ($p === 'groq' && !empty($c['groq_api_key'])) {
        $configured = true;
        $provider = 'groq';
    } elseif (!empty($c['gemini_api_key'])) {
        $configured = true;
        $provider = 'gemini';
    }
}

echo json_encode([
    'ok' => true,
    'configured' => $configured,
    'provider' => $provider,
]);
