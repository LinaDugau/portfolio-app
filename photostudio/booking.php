<?php
$host = "localhost";
$dbname = "f1185782_photostudio";
$username = "f1185782_photostudio"; // Измените, если другой
$password = "6dhibdRV"; // Измените, если другой

$conn = new mysqli($host, $username, $password, $dbname);

// Проверка подключения
if ($conn->connect_error) {
    die(json_encode(["error" => "Ошибка подключения: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $phone = isset($_POST['phone_number']) ? $_POST['phone_number'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $booking_date = isset($_POST['data']) ? $_POST['data'] : '';
    $booking_time_id = isset($_POST['time']) ? $_POST['time'] : '';
    $rate_id = isset($_POST['rate']) ? $_POST['rate'] : '';
    $comment = isset($_POST['comment']) ? $_POST['comment'] : '';

    // Проверка обязательных полей
    if (empty($name) || empty($phone) || empty($email) || empty($booking_date) || empty($booking_time_id) || empty($rate_id)) {
        echo json_encode(["error" => "Пожалуйста, заполните все обязательные поля!"]);
        exit();
    }

    // Проверка на занятость времени
    $check_query = "SELECT id FROM available_times WHERE booking_date = ? AND booking_time_id = ? AND is_booked = TRUE";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("si", $booking_date, $booking_time_id);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        echo json_encode(["error" => "Это время уже забронировано!"]);
        $stmt->close();
        exit();
    }

    $stmt->close();

    // Получение цены тарифа
    $price_query = "SELECT price FROM rates WHERE id = ?";
    $stmt = $conn->prepare($price_query);
    $stmt->bind_param("i", $rate_id);
    $stmt->execute();
    $stmt->bind_result($total_price);
    $stmt->fetch();

    // Если тариф не найден
    if (!$total_price) {
        echo json_encode(["error" => "Ошибка: выбранный тариф не существует."]);
        $stmt->close();
        exit();
    }

    $stmt->close();

    // Запись в bookings
    $insert_query = "INSERT INTO bookings (name, phone, email, booking_date, booking_time_id, rate_id, comment, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insert_query);
    $stmt->bind_param("ssssiisd", $name, $phone, $email, $booking_date, $booking_time_id, $rate_id, $comment, $total_price);
    
    if ($stmt->execute()) {
        // Обновляем available_times
        $update_query = "UPDATE available_times SET is_booked = TRUE WHERE booking_date = ? AND booking_time_id = ?";
        $stmt = $conn->prepare($update_query);
        $stmt->bind_param("si", $booking_date, $booking_time_id);
        $stmt->execute();

        echo json_encode(["success" => "Бронирование успешно!"]);
    } else {
        echo json_encode(["error" => "Ошибка при бронировании!"]);
    }
    
    $stmt->close();
}

$conn->close();
?>