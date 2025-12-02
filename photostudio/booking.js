document.addEventListener("DOMContentLoaded", function () {
    const timeSelect = document.getElementById("time");
    const rateSelect = document.getElementById("rate");
    const totalPriceElement = document.getElementById("total_price");
  
    // Функция для подсчета общей стоимости
    function updateTotalPrice() {
      const selectedTimeId = timeSelect.value;
      const selectedRateId = rateSelect.value;
  
      if (selectedTimeId && selectedRateId) {
        // Для простоты, можно на сервере получить цену тарифа и вычислить время
        // В этом примере предполагается, что на сервере вернется корректная цена
        const ratePrice = rateSelect.options[rateSelect.selectedIndex].text.split(' - ')[1].replace(' руб.', '');
        
        // Здесь можно добавить логику для расчета по времени или других факторов
        const totalPrice = parseFloat(ratePrice);
        totalPriceElement.textContent = totalPrice.toFixed(2);
      } else {
        totalPriceElement.textContent = '0.00';
      }
    }
  
    timeSelect.addEventListener("change", updateTotalPrice);
    rateSelect.addEventListener("change", updateTotalPrice);
  });  

  document.getElementById("data").addEventListener("change", function() {
    var selectedDate = this.value;
    
    // Отправляем AJAX запрос
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "get_available_times.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            if (data.times) {
                // Обновляем доступные интервалы времени
                var timeSelect = document.getElementById("time");
                timeSelect.innerHTML = '<option value="">ВРЕМЯ</option>'; // Сначала очищаем

                data.times.forEach(function(time) {
                    var option = document.createElement("option");
                    option.value = time.id;
                    option.textContent = time.time_start + ' - ' + time.time_end;
                    timeSelect.appendChild(option);
                });
            }

            if (data.rates) {
                // Обновляем тарифы
                var rateSelect = document.getElementById("rate");
                rateSelect.innerHTML = '<option value="">ВЫБРАТЬ ТАРИФ</option>'; // Сначала очищаем

                data.rates.forEach(function(rate) {
                    var option = document.createElement("option");
                    option.value = rate.id;
                    option.textContent = rate.name + ' - ' + rate.price + ' руб.';
                    rateSelect.appendChild(option);
                });
            }
        }
    };
    xhr.send("data=" + encodeURIComponent(selectedDate));
});
