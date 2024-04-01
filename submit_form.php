<?php

require 'PhpMailer/Exception.php';
require 'PhpMailer/PHPMailer.php';
require 'PhpMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if the request is a POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize form data
    $name = sanitize_input($_POST['client-name']);
    $email = sanitize_input($_POST['client-email']);
    $message = sanitize_input($_POST['message']);

    // Server-side validation
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'status' => 400, 'msg' => 'Please fill in all required fields.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'status' => 400, 'msg' => 'Invalid email address.']);
        exit;
    }

    // Validate attachments if any
    $allowedFileTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/quicktime'];
    if (!empty($_FILES['attachments']['tmp_name'][0])) {
        foreach ($_FILES['attachments']['tmp_name'] as $index => $tmpName) {
            $fileName = $_FILES['attachments']['name'][$index];
            $fileType = $_FILES['attachments']['type'][$index];
            $fileSize = $_FILES['attachments']['size'][$index];

            if (!in_array($fileType, $allowedFileTypes) || $fileSize > 10 * 1024 * 1024) {
                echo json_encode(['success' => false, 'status' => 400, 'msg' => 'Invalid file type or size exceeds 10MB.']);
                exit;
            }
        }
    }

    // Send email using PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Load SMTP configuration from a .env or configuration file
        // Assuming you have a file named 'config.php' with defined constants
        include 'config.php';

        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port       = SMTP_PORT;

        $mail->setFrom(SMTP_FROM_EMAIL);
        $mail->addAddress(SMTP_TO_EMAIL);
        $mail->addReplyTo($email);

        $mail->Subject = htmlspecialchars($name) . ': ' . htmlspecialchars(substr($message, 0, 30)) . '...';
        $mail->isHTML(true); 

        $mail->Body = "
            <html>
            <head>
            <title>Contact Form Submission</title>
            </head>
            <body>
            <h2>Contact form submission</h2>
            <br><br>
            <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
            <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
            <p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>
            <br><br><br>
            <p>This contact form was submitted.</p>
            </body>
            </html>
        ";

        // Attach uploaded files if available
        if (!empty($_FILES['attachments']['tmp_name'][0])) {
            foreach ($_FILES['attachments']['tmp_name'] as $index => $tmpName) {
                $fileName = $_FILES['attachments']['name'][$index];
                $mail->addAttachment($tmpName, $fileName);
            }
        }

        $mail->send();
        echo json_encode(['success' => true, 'status' => 201, 'msg' => 'Your message has been sent']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'status' => 500, 'msg' => 'Mailer Error: ' . $mail->ErrorInfo]);
    }
} else {
    // Not a POST request
    echo json_encode(['success' => false, 'status' => 405, 'msg' => 'Method Not Allowed']);

}
?>
