<?php
// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize form data
    $name = sanitize_input($_POST['name']);
    $email = sanitize_input($_POST['email']);
    $phone = sanitize_input($_POST['phone']);
    $message = sanitize_input($_POST['details']);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: services.html?status=error");
        exit();
    }

    // Prepare email content
    $to = "andvoskin@gmail.com";
    $subject = "New Contact Form Submission";
    
    $message_body = "New message from website contact form:\n\n";
    $message_body .= "Name: " . $name . "\n";
    $message_body .= "Email: " . $email . "\n";
    $message_body .= "Phone: " . $phone . "\n";
    $message_body .= "Message: " . $message . "\n";

    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($to, $subject, $message_body, $headers)) {
        header("Location: services.html?status=success");
        exit();
    } else {
        header("Location: services.html?status=error");
        exit();
    }
} else {
    // If not a POST request, redirect to services page
    header("Location: services.html");
    exit();
}
?> 