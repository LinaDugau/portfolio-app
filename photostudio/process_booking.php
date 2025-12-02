<?php
// Подключаемся к базе данных
$host = "localhost";
$dbname = "f1185782_photostudio";
$username = "f1185782_photostudio"; // или ваш пользователь MySQL
$password = "6dhibdRV"; // если есть пароль, укажите его

$conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Массив для ошибок
$errors = [];

// Получаем данные из формы
$name = $_POST['name'] ?? '';
$phone_number = $_POST['phone_number'] ?? '';
$email = $_POST['email'] ?? '';
$date = $_POST['data'] ?? '';
$time = $_POST['time'] ?? '';
$rate = $_POST['rate'] ?? '';
$comment = $_POST['comment'] ?? '';

// Валидация данных
if (empty($name)) {
    $errors[] = "Имя обязательно для заполнения.";
}
if (empty($phone_number)) {
    $errors[] = "Номер телефона обязателен.";
}
if (empty($email)) {
    $errors[] = "Электронная почта обязательна.";
}
if (empty($date)) {
    $errors[] = "Дата обязательна.";
}
if (empty($time)) {
    $errors[] = "Время обязательно.";
}
if (empty($rate)) {
    $errors[] = "Выберите тариф.";
}

// Если есть ошибки, отправляем их обратно в формате JSON
if (!empty($errors)) {
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit();
}

// Проверяем, есть ли уже бронирование на выбранную дату и время
$stmt = $conn->prepare("SELECT COUNT(*) FROM bookings WHERE date = :date AND time_slot_id = :time");
$stmt->execute(['date' => $date, 'time' => $time]);
$count = $stmt->fetchColumn();

if ($count > 0) {
    $errors[] = "Извините, это время уже занято. Пожалуйста, выберите другое.";
}

// Получаем цену тарифа из таблицы rates
$stmt = $conn->prepare("SELECT price FROM rates WHERE id = :rate");
$stmt->execute(['rate' => $rate]);
$rate_data = $stmt->fetch(PDO::FETCH_ASSOC);

// Если тариф не найден, выводим ошибку
if (!$rate_data) {
    $errors[] = "Тариф не найден.";
}

// Если тариф по сертификату, то проверяем, передан ли комментарий
$total_price = $rate_data['price']; // Начальная цена
if ($rate == 3 || $rate == 4) { // Проверяем, что тариф по сертификату
    if (empty($comment)) {
        $errors[] = "Пожалуйста, укажите комментарий при записи по сертификату.";
    }
}

// Если есть ошибки, отправляем их обратно в формате JSON
if (!empty($errors)) {
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit();
}

// Вставляем данные в таблицу bookings
$stmt = $conn->prepare("INSERT INTO bookings (name, phone_number, email, date, time_slot_id, rate_id, total_price, comment) 
                        VALUES (:name, :phone_number, :email, :date, :time, :rate, :total_price, :comment)");
$stmt->execute([
    'name' => $name,
    'phone_number' => $phone_number,
    'email' => $email,
    'date' => $date,
    'time' => $time,
    'rate' => $rate,
    'total_price' => $total_price,
    'comment' => $comment
]);

// Получаем ID только что добавленного бронирования
$booking_id = $conn->lastInsertId();

// Перенаправляем пользователя на страницу с оплатой
echo json_encode(['status' => 'success', 'booking_id' => $booking_id]);
exit();
?>