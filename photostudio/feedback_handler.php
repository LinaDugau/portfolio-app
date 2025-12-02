<?php
// Параметры подключения к базе данных
$host = 'localhost'; // или ваш хост
$dbname = 'f1185782_photostudio'; // название вашей базы данных
$username = 'f1185782_photostudio'; // имя пользователя базы данных
$password = '6dhibdRV'; // пароль пользователя

// Создаем соединение с базой данных
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Ошибка подключения: " . $e->getMessage();
    exit;
}

// Проверяем, была ли отправлена форма
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $name = htmlspecialchars(trim($_POST['name-feedback']));
    $phone = htmlspecialchars(trim($_POST['phone_number-feedback']));
    $email = htmlspecialchars(trim($_POST['email-feedback']));
    $comment = htmlspecialchars(trim($_POST['comment-feedback']));

    // Проверяем, что все обязательные поля заполнены
    if (empty($name) || empty($phone) || empty($email) || empty($comment)) {
        echo "Пожалуйста, заполните все обязательные поля.";
        exit;
    }

    // Проверяем, согласен ли пользователь с обработкой данных
    if (!isset($_POST['processing-feedback'])) {
        echo "Вы должны согласиться на обработку персональных данных.";
        exit;
    }

    // Подготавливаем запрос для вставки данных в таблицу feedback
    $sql = "INSERT INTO feedback (name, phone, email, comment) VALUES (:name, :phone, :email, :comment)";
    $stmt = $pdo->prepare($sql);

    // Привязываем параметры
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':comment', $comment);

    // Выполняем запрос и проверяем успешность
    try {
        $stmt->execute();
        echo "Ваша заявка успешно отправлена!";
    } catch (PDOException $e) {
        echo "Ошибка: " . $e->getMessage();
    }
}
?>