<?php
require 'db.php';

// Константы для пагинации
$reviews_per_page = 4; // Количество отзывов на одной странице
$current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;

// Обработка отправки нового отзыва
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $author_name = $_POST['author_name'] ?? null;
    $service_id = $_POST['service_id'] ?? 0;
    $text = $_POST['text'] ?? '';
    $rating = $_POST['rating'] ?? 0;

    if ($service_id <= 0 || trim($text) === '' || $rating < 1 || $rating > 5) {
        echo "<p class='error'>Пожалуйста, проверьте введенные данные.</p>";
    }

    $stmt = $pdo->prepare("INSERT INTO reviews (author_name, service_id, text, rating) 
                           VALUES (:author_name, :service_id, :text, :rating)");
    $stmt->execute([ 
        ':author_name' => $author_name ?: null, 
        ':service_id' => $service_id, 
        ':text' => $text, 
        ':rating' => $rating, 
    ]);

    // Перезагрузка страницы после добавления
    header("Location: reviews.php?page=" . $current_page);
    exit;
}

// Получение списка услуг для выпадающего меню
$services_stmt = $pdo->query("SELECT * FROM services");
$services = $services_stmt->fetchAll(PDO::FETCH_ASSOC);

// Подсчет общего количества отзывов
$total_reviews_stmt = $pdo->query("SELECT COUNT(*) FROM reviews");
$total_reviews = $total_reviews_stmt->fetchColumn();
$total_pages = ceil($total_reviews / $reviews_per_page);

// Получение отзывов для текущей страницы
$offset = ($current_page - 1) * $reviews_per_page;
$reviews_stmt = $pdo->prepare(" 
    SELECT reviews.*, services.name AS service_name 
    FROM reviews 
    JOIN services ON reviews.service_id = services.id 
    ORDER BY reviews.date_added DESC 
    LIMIT :limit OFFSET :offset 
");
$reviews_stmt->bindValue(':limit', $reviews_per_page, PDO::PARAM_INT);
$reviews_stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$reviews_stmt->execute();
$reviews = $reviews_stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Рекламное Агенство Наружка</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <container class="container header-container">
        <a href="#" class="logot"><img src="./assets/image/logo.svg" alt="Логотип"></a>
        <nav>
            <ul>
                <li><a href="#o_komp" style="margin-left: 392px; margin-right: 20px">О компании</a></li>
                <li>
                    <a href="#uslugi" style="margin-left: 32px;">Услуги<img src="./assets/image/1.svg"></a></a>
                    <ul>
                        <li><a href="naruz.html">Наружная реклама</a></li>
                        <li><a href="inter.html">Интерьерная реклама</a></li>
                        <li><a href="poligraph.html">Полиграфия</a></li>
                    </ul>
                </li>
                <li><a href="#otzivi" style="margin-left: 43.86px">Отзывы</a></li>
                <li><a href="contacts.html" style="margin-left: 48px">Контакты</a></li>
                <li><a href="#form-section" class="svaz" style="margin-left: 32px">Обратная связь</a></li>
            </ul>
        </nav>
        </container>
    </header>
    <main>
    <div class="container_miumiu">
                <ol class="breadcrumb" itemscope="" itemtype="https://schema.org/BreadcrumbList">
                    <li class="breadcrumb-item" itemprop="itemListElement" itemscope="" itemtype="https://schema.org/ListItem"><a itemprop="url" href="index2.html"><span itemprop="name">Главная страница /&nbsp</span></a></li>
                    <li class="breadcrumb-item active" aria-current="page" itemprop="itemListElement" itemscope="" itemtype="https://schema.org/ListItem"><span itemprop="name">Отзывы</span></li>
                </ol>
            </div>      
    <div class="container_reviews">
        <h1 class="page-title">Отзывы</h1>
        <!-- Форма добавления нового отзыва -->
        <form action="reviews.php?page=<?= $current_page ?>" method="POST" class="review-form">
            <div class="input-group">
                <input type="text" id="author_name" name="author_name" placeholder="Ваше имя (необязательно):">
            </div>

            <div class="input-group">
                <select id="service_id" name="service_id" required>
                    <option value="">Выберите услугу</option>
                    <?php foreach ($services as $service): ?>
                        <option value="<?= $service['id'] ?>"><?= htmlspecialchars($service['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="input-group">
                <textarea id="text" name="text" required placeholder="Введите ваш отзыв" class="input-text"></textarea>
            </div>

            <div class="input-group">
                <select id="rating" name="rating" required>
                    <option value="">Выберите оценку</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <div class="buttom_wrapper">
                <button type="submit" class="submit-button">Отправить отзыв</button>
            </div>
        </form>

        <hr class="white">

        <!-- Список отзывов -->
        <?php if ($reviews): ?>
            <?php foreach ($reviews as $review): ?>
                <div class="review">
                    <p><strong>Имя:</strong> <?= htmlspecialchars($review['author_name'] ?: 'Аноним') ?></p>
                    <p><strong>Услуга:</strong> <?= htmlspecialchars($review['service_name']) ?></p>
                    <p><strong>Оценка:</strong> <?= $review['rating'] ?>/5</p>
                    <p><strong>Отзыв:</strong> <?= nl2br(htmlspecialchars($review['text'])) ?></p>
                    <p><small><strong>Дата:</strong> <?= date('d.m.Y H:i', strtotime($review['date_added'])) ?></small></p>
                </div>
                <hr class="white">
            <?php endforeach; ?>
        <?php else: ?>
            <p>Отзывов пока нет.</p>
        <?php endif; ?>

        <!-- Навигация по страницам -->
        <div class="pagination">
            <?php if ($current_page > 1): ?>
                <a href="reviews.php?page=<?= $current_page - 1 ?>" class="pagination-link">&laquo; </a>
            <?php endif; ?>

            <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                <?php if ($i == $current_page): ?>
                    <span class="pagination-current"><?= $i ?></span>
                <?php else: ?>
                    <a href="reviews.php?page=<?= $i ?>" class="pagination-link"><?= $i ?></a>
                <?php endif; ?>
            <?php endfor; ?>

            <?php if ($current_page < $total_pages): ?>
                <a href="reviews.php?page=<?= $current_page + 1 ?>" class="pagination-link"> &raquo;</a>
            <?php endif; ?>
        </div>
    </div>
</main>
<footer>
        <div class="container_r">
            <div class="crap">
            <div class="bbloki_crap1">
                <div class="wap">
                    <a href="#" class="logo1"><img src="./assets/image/logo.svg" alt="Логотип" class="logo1"></a>
                    <p style="margin-top: 29px">© 2024 Наружка</p>
                </div>
                <div class="wap">
                    <p style="margin-top: 16px" class="mip">Наружка в соцсетях:</p>
                    <div class="cpap">
                        <a href="https://vk.com/club28889400"><img src="assets/image/21.svg" style="width: 38px; height: 38px;" class="filter-yellow"></a>
                        <a href="http://odnoklassniki.ru/#/group/51011496902822"><img src="assets/image/22.svg" style="width: 38px; height: 38px;" class="filter-yellow"></a>
                    </div>
                </div>
            </div>
            <div class="bbloki_crap2">
                <p style="margin-bottom: 20px;"><a href="#uslugi" class="bolz" >Услуги</a></p>
                <p style="margin-bottom: 15px;"><a href="naruz.html" class="menz" >Наружная реклама</a></p>
                <p style="margin-bottom: 15px;"><a href="inter.html" class="menz" >Интерьерная реклама</a></p>
                <p style="margin-bottom: 20px;"><a href="poligraph.html" class="menz" >Полиграфия</a></p>
                <a href="contacts.html" class="bolz">Отзывы</a>
            </div>
            <div class="bbloki_crap3">
                <p style="margin-bottom: 20px;"><a href="contacts.html" class="bolz">Контакты</a></p>
                <p class="tuext">601901, Владимирская область, город Ковров, проспект Ленина, 49. <br>
                    тел./факс: 8-905-649-13-55<br> эл. почта: info@naruzka.ru <br> Офис: пр-т Ленина 49 <br>
                    Производство: ул. Муромская , 9А</p>
            </div>
        </div>
        </div>
    </footer>
</body>
</html>