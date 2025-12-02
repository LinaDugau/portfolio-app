document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("feedback-form");
    const messageBox = document.getElementById("feedback-message");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        // Получаем данные формы
        let formData = new FormData(form);

        // Проверяем, что чекбокс установлен
        const isProcessingChecked = document.getElementById("processing-feedback").checked;

        if (!isProcessingChecked) {
            messageBox.className = "error"; // Устанавливаем класс ошибки
            messageBox.textContent = "Вы должны согласиться на обработку персональных данных!";
            messageBox.style.display = "block"; // Показываем сообщение об ошибке
            return; // Если чекбокс не установлен, не отправляем форму
        }

        fetch("feedback_handler.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json()) // Парсим JSON-ответ
        .then(data => {
            // Добавляем класс и текст в зависимости от статуса ответа
            messageBox.className = data.status; // success или error
            messageBox.textContent = data.message;
            messageBox.style.display = "block"; // Показываем сообщение

            if (data.status === "success") {
                form.reset(); // Очищаем форму после успешной отправки
            }

            setTimeout(() => {
                messageBox.style.display = "none"; // Скрываем сообщение через 3 секунды
            }, 3000);
        })
        .catch(error => {
            console.error("Ошибка:", error);
            messageBox.className = "error"; // В случае ошибки отправки
            messageBox.textContent = "Ошибка отправки. Попробуйте снова.";
            messageBox.style.display = "block";
        });
    });
});