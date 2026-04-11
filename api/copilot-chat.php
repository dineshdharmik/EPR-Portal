<?php
/**
 * AI Copilot chat proxy — keeps API keys off the browser.
 * Expects POST JSON: { "messages": [ { "role": "user"|"assistant", "content": "..." }, ... ] }
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$configPath = __DIR__ . '/copilot-config.local.php';
if (!is_readable($configPath)) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'error' => 'Copilot is not configured. Copy api/copilot-config.example.php to api/copilot-config.local.php and add your API key.',
    ]);
    exit;
}

$config = require $configPath;
$provider = isset($config['provider']) ? strtolower((string) $config['provider']) : 'gemini';

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body) || !isset($body['messages']) || !is_array($body['messages'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON: expected { "messages": [...] }']);
    exit;
}

$systemPrompt = <<<'SYS'
You are EPR Copilot for an Indian Extended Producer Responsibility (EPR) portal. You help with PWMR (plastic), BWMR (battery), EWMR (e-waste), CPCB compliance concepts, credits, recyclers, and reporting in general terms.

Rules:
- Be concise and practical. Use clear headings or bullets when helpful.
- Do not invent account-specific numbers, deadlines, or legal facts; say when the user must check CPCB notifications, their EPR plan, or their consultant.
- If asked for legal advice, suggest verifying with a qualified professional.
SYS;

$maxTurns = 24;
$maxLen = 6000;
$messages = array_slice($body['messages'], -$maxTurns);
$clean = [];
foreach ($messages as $m) {
    if (!is_array($m)) {
        continue;
    }
    $role = isset($m['role']) ? (string) $m['role'] : '';
    $content = isset($m['content']) ? (string) $m['content'] : '';
    $content = trim($content);
    if ($content === '') {
        continue;
    }
    if (strlen($content) > $maxLen) {
        $content = substr($content, 0, $maxLen);
    }
    if ($role === 'user' || $role === 'assistant') {
        $clean[] = ['role' => $role, 'content' => $content];
    }
}

if ($clean === [] || end($clean)['role'] !== 'user') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Last message must be from the user.']);
    exit;
}

function json_response(int $code, array $payload): void
{
    http_response_code($code);
    echo json_encode($payload);
    exit;
}

function http_post_json(string $url, array $headers, array $payload, int $timeout = 90): array
{
    $ch = curl_init($url);
    $json = json_encode($payload);
    $headers[] = 'Content-Type: application/json';
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => $json,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => $timeout,
    ]);
    $resp = curl_exec($ch);
    $err = curl_error($ch);
    $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['body' => $resp === false ? '' : $resp, 'http' => $http, 'curl_error' => $err];
}

if ($provider === 'groq') {
    $key = isset($config['groq_api_key']) ? trim((string) $config['groq_api_key']) : '';
    if ($key === '') {
        json_response(503, ['ok' => false, 'error' => 'Groq API key missing in copilot-config.local.php']);
    }
    $model = isset($config['groq_model']) && $config['groq_model'] !== ''
        ? (string) $config['groq_model']
        : 'llama-3.3-70b-versatile';

    $chatMessages = [['role' => 'system', 'content' => $systemPrompt]];
    foreach ($clean as $m) {
        $chatMessages[] = ['role' => $m['role'], 'content' => $m['content']];
    }

    $r = http_post_json(
        'https://api.groq.com/openai/v1/chat/completions',
        ['Authorization: Bearer ' . $key],
        [
            'model' => $model,
            'messages' => $chatMessages,
            'temperature' => 0.5,
            'max_tokens' => 2048,
        ]
    );

    if ($r['curl_error'] !== '') {
        json_response(502, ['ok' => false, 'error' => 'Network error contacting AI service.']);
    }

    $data = json_decode($r['body'], true);
    if ($r['http'] >= 400) {
        $msg = is_array($data) && isset($data['error']['message'])
            ? (string) $data['error']['message']
            : 'AI service error (' . $r['http'] . ')';
        json_response(502, ['ok' => false, 'error' => $msg]);
    }

    $text = '';
    if (is_array($data) && isset($data['choices'][0]['message']['content'])) {
        $text = (string) $data['choices'][0]['message']['content'];
    }
    if ($text === '') {
        json_response(502, ['ok' => false, 'error' => 'Empty response from AI service.']);
    }

    echo json_encode(['ok' => true, 'text' => $text]);
    exit;
}

// Default: Gemini
$key = isset($config['gemini_api_key']) ? trim((string) $config['gemini_api_key']) : '';
if ($key === '') {
    json_response(503, ['ok' => false, 'error' => 'Gemini API key missing in copilot-config.local.php']);
}

// gemini-1.5-* removed from v1beta; use 2.5 Flash family (see ai.google.dev/gemini-api/docs/models)
$geminiFallbackChain = [
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
];

$configuredModel = isset($config['gemini_model']) && trim((string) $config['gemini_model']) !== ''
    ? trim((string) $config['gemini_model'])
    : 'gemini-2.5-flash-lite';

$modelsToTry = array_values(array_unique(array_merge(
    [$configuredModel],
    $geminiFallbackChain
)));

$contents = [];
foreach ($clean as $m) {
    $role = $m['role'] === 'assistant' ? 'model' : 'user';
    $contents[] = [
        'role' => $role,
        'parts' => [['text' => $m['content']]],
    ];
}

$payload = [
    'contents' => $contents,
    'systemInstruction' => [
        'parts' => [['text' => $systemPrompt]],
    ],
    'generationConfig' => [
        'temperature' => 0.5,
        'maxOutputTokens' => 2048,
    ],
];

$lastMsg = '';
$lastHttp = 0;
foreach ($modelsToTry as $idx => $tryModel) {
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/'
        . rawurlencode($tryModel)
        . ':generateContent?key=' . rawurlencode($key);

    $r = http_post_json($url, [], $payload);

    if ($r['curl_error'] !== '') {
        $lastMsg = 'Network error contacting AI service.';
        $lastHttp = 502;
        break;
    }

    $data = json_decode($r['body'], true);
    $lastHttp = $r['http'];

    if ($r['http'] >= 400) {
        $lastMsg = 'AI service error (' . $r['http'] . ')';
        if (is_array($data) && isset($data['error']['message'])) {
            $lastMsg = (string) $data['error']['message'];
        }
        $low = strtolower($lastMsg);
        $quotaLike = $r['http'] === 429 || $r['http'] === 403
            || strpos($low, 'quota') !== false
            || strpos($low, 'resource_exhausted') !== false
            || strpos($low, 'limit: 0') !== false;
        $modelMissing = strpos($low, 'not found') !== false
            || strpos($low, 'listmodels') !== false
            || strpos($low, 'is not supported for generatecontent') !== false;
        if (($quotaLike || $modelMissing) && $idx < count($modelsToTry) - 1) {
            continue;
        }
        $code = $r['http'] === 429 ? 429 : 502;
        json_response($code, ['ok' => false, 'error' => $lastMsg]);
    }

    $text = '';
    if (is_array($data) && isset($data['candidates'][0]['content']['parts'][0]['text'])) {
        $text = (string) $data['candidates'][0]['content']['parts'][0]['text'];
    }
    if ($text === '' && is_array($data)) {
        if (!empty($data['candidates'][0]['finishReason']) && $data['candidates'][0]['finishReason'] === 'SAFETY') {
            json_response(200, ['ok' => false, 'error' => 'Response was blocked by safety filters. Try rephrasing your question.']);
        }
    }

    if ($text !== '') {
        echo json_encode(['ok' => true, 'text' => $text]);
        exit;
    }

    $lastMsg = 'Empty response from AI service.';
    if ($idx < count($modelsToTry) - 1) {
        continue;
    }
}

json_response(
    $lastHttp === 429 ? 429 : 502,
    [
        'ok' => false,
        'error' => $lastMsg !== '' ? $lastMsg : 'Empty response from AI service. Set gemini_model to gemini-2.5-flash-lite or switch provider to groq.',
    ]
);
