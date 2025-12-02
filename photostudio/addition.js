// Появление второй шапки
document.addEventListener("DOMContentLoaded", function () {
  const headerTwo = document.querySelector(".container-header-two");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      headerTwo.classList.add("active");
    } else {
      headerTwo.classList.remove("active");
    }
  });
});

// Отображение модального окна брони
document.addEventListener("DOMContentLoaded", function () {
  let openButtons = document.querySelectorAll(
    ".black_white_button, .black_button, .btn-application"
  );
  let modal = document.querySelector(".modal");
  let closeButton = document.querySelector(".close");
  let overlay = document.querySelector(".modal-overlay");

  // Максимальная прокрутка страницы
  const maxScrollPosition = 1100;
  let isModalOpen = false; // Флаг для отслеживания, открыто ли модальное окно

  // Функция для открытия модального окна
  function openModal() {
    isModalOpen = true;
    modal.style.display = "block";
    overlay.style.display = "block";
    modal.classList.add("modal-animation");

    // Прокручиваем страницу до модального окна с небольшой компенсацией
    let modalPosition = modal.getBoundingClientRect().top + window.scrollY - 20;

    // Прокрутка до модального окна
    window.scrollTo({ top: modalPosition, behavior: "smooth" });

    // Используем setTimeout для задержки, чтобы дать время анимации прокрутки
    setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
    }, 600); // Задержка 600мс для плавной прокрутки
  }

  // Функция для закрытия модального окна
  function closeModal() {
    isModalOpen = false;
    modal.style.display = "none";
    overlay.style.display = "none";
    modal.classList.remove("modal-animation");

    // Убираем обработчик прокрутки
    window.removeEventListener("scroll", handleScroll);
  }

  // Обработчик события прокрутки
  function handleScroll() {
    // Если модальное окно открыто, и страница прокручена ниже 800px, блокируем прокрутку
    if (isModalOpen && window.scrollY > maxScrollPosition) {
      window.scrollTo(0, maxScrollPosition); // Блокируем прокрутку на 800px
    }
  }

  // Навешиваем событие на кнопки для открытия модального окна
  openButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (!isModalOpen) {
        openModal();
      }
    });
  });

  // Закрытие модального окна по кнопке креста и клику на затемнение
  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  // Закрытие модального окна по клавише Escape
  document.addEventListener("keydown", function (e) {
    if (e.code === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });
});

// Обратная связь
document.addEventListener("DOMContentLoaded", function () {
  let openButton = document.querySelector(".black_white_button_contacts");
  let modal = document.querySelector(".modal-feedback");
  let closeButton = document.querySelector(".close-feedback");
  let overlay = document.querySelector(".modal-overlay-feedback");

  const form = document.getElementById("feedback-form");
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

  // Функция для валидации формы
  function validateForm() {
    const phone = document.getElementById("phone_number-feedback");
    const email = document.getElementById("email-feedback");

    // Регулярные выражения для проверки корректности данных
    const phoneRegex =
      /^(\+?\d{1,4})?[\s-]?\(?\d{1,3}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}$/; // Пример: +1234567890
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Очистка предыдущих сообщений об ошибках
    errorMessage.innerHTML = "";

    // Проверка телефона
    if (!phone.value || !phoneRegex.test(phone.value)) {
      errorMessage.innerHTML +=
        "Пожалуйста, введите корректный номер телефона.<br>";
      return false;
    }

    // Проверка email
    if (!emailRegex.test(email.value)) {
      errorMessage.innerHTML += "Пожалуйста, введите корректный email.<br>";
      return false;
    }

    return true;
  }

  // Обработчик отправки формы
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы

    if (validateForm()) {
      // Если форма прошла валидацию, отправляем данные через AJAX
      const formData = new FormData(form);

      fetch("feedback_handler.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((result) => {
          // Если запрос успешен, показываем сообщение об успехе
          if (result === "Ваша заявка успешно отправлена!") {
            errorMessage.innerHTML = ""; // Очищаем старые ошибки
            successMessage.innerHTML =
              "Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.";
            form.reset(); // Очищаем поля формы

            // Скрываем сообщение через 5 секунд
            setTimeout(() => {
              successMessage.style.display = "none";
            }, 5000);
          } else {
            // В случае ошибки выводим сообщение
            errorMessage.innerHTML =
              "Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          errorMessage.innerHTML =
            "Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.";
        });
    }
  });

  // Максимальная прокрутка страницы
  const maxScrollPosition = 1100;
  let isModalOpen = false; // Флаг для отслеживания, открыто ли модальное окно

  // Функция для открытия модального окна
  function openModal() {
    isModalOpen = true;
    modal.style.display = "block";
    overlay.style.display = "block";
    modal.classList.add("modal-animation-feedback");

    // Прокручиваем страницу до модального окна с небольшой компенсацией
    let modalPosition = modal.getBoundingClientRect().top + window.scrollY - 20;

    // Прокрутка до модального окна
    window.scrollTo({ top: modalPosition, behavior: "smooth" });

    // Используем setTimeout для задержки, чтобы дать время анимации прокрутки
    setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
    }, 600); // Задержка 600мс для плавной прокрутки
  }

  // Функция для закрытия модального окна
  function closeModal() {
    isModalOpen = false;
    modal.style.display = "none";
    overlay.style.display = "none";
    modal.classList.remove("modal-animation-feedback");

    // Убираем обработчик прокрутки
    window.removeEventListener("scroll", handleScroll);
  }

  // Обработчик события прокрутки
  function handleScroll() {
    // Если модальное окно открыто, и страница прокручена ниже 800px, блокируем прокрутку
    if (isModalOpen && window.scrollY > maxScrollPosition) {
      window.scrollTo(0, maxScrollPosition); // Блокируем прокрутку на 800px
    }
  }

  // Навешиваем событие на кнопку для открытия модального окна
  openButton.addEventListener("click", function () {
    if (!isModalOpen) {
      openModal();
    }
  });

  // Закрытие модального окна по кнопке креста и клику на затемнение
  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  // Закрытие модального окна по клавише Escape
  document.addEventListener("keydown", function (e) {
    if (e.code === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });
});

// Кнопка наверх
const btnUp = {
  el: document.querySelector(".btn-up"),
  scrolling: false,
  show() {
    if (
      this.el.classList.contains("btn-up_hide") &&
      !this.el.classList.contains("btn-up_hiding")
    ) {
      this.el.classList.remove("btn-up_hide");
      this.el.classList.add("btn-up_hiding");
      window.setTimeout(() => {
        this.el.classList.remove("btn-up_hiding");
      }, 300);
    }
  },
  hide() {
    if (
      !this.el.classList.contains("btn-up_hide") &&
      !this.el.classList.contains("btn-up_hiding")
    ) {
      this.el.classList.add("btn-up_hiding");
      window.setTimeout(() => {
        this.el.classList.add("btn-up_hide");
        this.el.classList.remove("btn-up_hiding");
      }, 300);
    }
  },
  addEventListener() {
    // при прокрутке окна (window)
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (this.scrolling && scrollY > 0) {
        return;
      }
      this.scrolling = false;
      // если пользователь прокрутил страницу более чем на 200px
      if (scrollY > 800) {
        // сделаем кнопку .btn-up видимой
        this.show();
      } else {
        // иначе скроем кнопку .btn-up
        this.hide();
      }
    });
    // при нажатии на кнопку .btn-up
    document.querySelector(".btn-up").onclick = () => {
      this.scrolling = true;
      this.hide();
      // переместиться в верхнюю часть страницы
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };
  },
};

btnUp.addEventListener();

document.addEventListener("DOMContentLoaded", function () {
  // Элементы, которые нужно скрывать
  const burgerContainers = document.querySelectorAll(
    ".burger-container, .burger-container-black"
  );
  const modalOverlays = document.querySelectorAll(
    ".modal-overlay, .modal-overlay-feedback"
  );
  const modals = document.querySelectorAll(".modal, .modal-feedback");

  // Функция для скрытия бургер-меню
  function hideBurgerContainers() {
    burgerContainers.forEach((container) => {
      container.style.display = "none";
    });
  }

  // Функция для показа бургер-меню
  function showBurgerContainers() {
    burgerContainers.forEach((container) => {
      container.style.display = ""; // Возвращаем исходное значение
    });
  }

  // Наблюдатель за изменениями атрибутов модальных окон
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "style") {
        const isAnyModalOpen = Array.from(modals).some(
          (modal) => modal.style.display === "block"
        );

        if (isAnyModalOpen) {
          hideBurgerContainers();
        } else {
          showBurgerContainers();
        }
      }
    });
  });

  // Начинаем наблюдение за всеми модальными окнами
  modals.forEach((modal) => {
    observer.observe(modal, {
      attributes: true,
      attributeFilter: ["style"],
    });
  });

  // Дополнительная обработка кликов по оверлею
  modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", function () {
      showBurgerContainers();
    });
  });
});
