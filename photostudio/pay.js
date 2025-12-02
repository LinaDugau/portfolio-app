// Функция для маски ввода номера карты
function maskCardNumber(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Убираем все нецифровые символы
    let formattedValue = value.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); // Разделяем на группы по 4 цифры
    input.value = formattedValue;
}

// Функция для маски ввода срока действия карты (MMYY)
function maskExpiry(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Убираем все нецифровые символы

    // Ограничиваем длину до 4 цифр
    if (value.length > 4) {
        value = value.slice(0, 4);
    }

    // Проверка, чтобы первые две цифры были валидным месяцем (01-12)
    if (value.length >= 2) {
        let month = value.slice(0, 2);
        if (parseInt(month) > 12) {
            value = "12" + value.slice(2);
        }
    }

    input.value = value;
}

// Функция для маски ввода CVV
function maskCvv(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Убираем все нецифровые символы
    input.value = value.slice(0, 3); // Ограничиваем длину до 3 цифр
}

// Функция для проверки номера карты
function validateCardNumber(value) {
    return /^\d{16}$/.test(value.replace(/\s+/g, '')); // Убираем пробелы, если они есть
}

// Функция для проверки срока действия карты
function validateExpiry(value) {
    const regex = /^(0[1-9]|1[0-2])\d{2}$/; // MMYY

    if (!regex.test(value)) {
        return false;
    }

    const month = value.slice(0, 2);
    const year = value.slice(2, 4);
    const currentDate = new Date();
    const expiryDate = new Date(`20${year}-${month}-01`);

    return expiryDate >= currentDate;
}

// Функция для проверки CVV
function validateCvv(value) {
    return /^\d{3}$/.test(value);
}

// Функция для отображения окна с ошибкой и затемнения фона
function showError(message) {
    const errorWindow = document.getElementById('error-window');
    const errorMessage = document.getElementById('error-message');
    const overlay = document.getElementById('overlay');

    errorMessage.textContent = message;
    errorWindow.style.display = 'block';
    overlay.style.display = 'block';
}

// Функция для закрытия окна ошибки и снятия затемнения
function closeErrorWindow() {
    document.getElementById('error-window').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Функция для обработки отправки формы
function handleSubmit(event) {
    event.preventDefault(); // Останавливаем стандартную отправку формы

    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    let valid = true;
    let errorMessage = '';

    // Проверка номера карты
    if (!validateCardNumber(cardNumber)) {
        errorMessage += 'Номер карты должен содержать 16 цифр.\n';
        valid = false;
    }

    // Проверка срока действия
    if (!validateExpiry(expiry)) {
        errorMessage += 'Введите корректный срок действия карты.\n';
        valid = false;
    }

    // Проверка CVV
    if (!validateCvv(cvv)) {
        errorMessage += 'CVV должен содержать 3 цифры.\n';
        valid = false;
    }

    // Если есть ошибки, показать окно с ошибками
    if (!valid) {
        showError(errorMessage);
    } else {
        // Если всё корректно, отправляем форму
        document.getElementById('payment-form').submit();
    }
}

// Добавляем обработчики событий
document.getElementById('card-number').addEventListener('input', maskCardNumber);
document.getElementById('expiry').addEventListener('input', maskExpiry);
document.getElementById('cvv').addEventListener('input', maskCvv);
document.getElementById('payment-form').addEventListener('submit', handleSubmit);
document.getElementById('close-error-window').addEventListener('click', closeErrorWindow);


document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        const link = document.querySelector("a.grey"); // Получаем ссылку
        if (link) {
            window.location.href = link.href; // Переход на указанный сайт
        }
    }, 10000); // 10 секунд (10000 миллисекунд)
});