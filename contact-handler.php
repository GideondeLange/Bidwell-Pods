<?php
// Handles the contact/quote form on contact.html and emails it to info@bidwellpods.co.za.
// Requires PHP on the host (Hostinger shared hosting supports this by default).

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

function clean_field($value) {
    $value = trim((string) $value);
    // Strip line breaks so a submitted value can't inject extra mail headers.
    return preg_replace('/[\r\n]+/', ' ', $value);
}

$name    = isset($_POST['name']) ? clean_field($_POST['name']) : '';
$email   = isset($_POST['email']) ? clean_field($_POST['email']) : '';
$phone   = isset($_POST['phone']) ? clean_field($_POST['phone']) : '';
$service = isset($_POST['service']) ? clean_field($_POST['service']) : '';
$message = isset($_POST['message']) ? trim((string) $_POST['message']) : '';

// Honeypot field: real visitors never fill this in, bots often do.
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in your name, a valid email address, and a message.']);
    exit;
}

$to      = 'info@bidwellpods.co.za';
$subject = 'Quote Request: ' . ($service !== '' ? $service : 'Bidwell Pods');

$body  = "New enquiry from the Bidwell Pods website\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= 'Phone: ' . ($phone !== '' ? $phone : 'Not provided') . "\n";
$body .= 'Service: ' . ($service !== '' ? $service : 'Not specified') . "\n\n";
$body .= "Message:\n$message\n";

$headers   = [];
$headers[] = 'From: Bidwell Pods Website <no-reply@bidwellpods.co.za>';
$headers[] = "Reply-To: $name <$email>";
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Something went wrong sending your message. Please email us directly at info@bidwellpods.co.za.']);
}
