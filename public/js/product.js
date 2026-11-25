document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#product-detail");
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get("id");
  
  if (!root) return;
  if (!id) {
    root.innerHTML = '<p class="empty-state">Товар не выбран. Перейдите в каталог.</p>';
    return;
  }

  const productsData = {
    1: { name: "Набор керамических тарелок", price: 5490, category: "Посуда", img: "/тарелка.png", desc: "Красивый набор тарелок из керамики. Отлично подойдет для уютных семейных ужинов и праздничной сервировки." },
    2: { name: "Чашка с блюдцем Sand", price: 2890, category: "Посуда", img: "/чашка.png", desc: "Стильная чашка песочно-бежевого оттенка. Идеальна для утреннего кофе или чая." },
    3: { name: "Ваза Forma", price: 1790, category: "Декор", img: "/ваза.png", desc: "Декоративная ваза необычной формы станет изюминкой вашего интерьера." },
    4: { name: "Ароматическая свеча Home", price: 1190, category: "Декор", img: "/свеча.png", desc: "Наполнит ваш дом уютным ароматом и создаст романтическую атмосферу." },
    5: { name: "Плед Soft Touch", price: 3290, category: "Текстиль", img: "/плед.png", desc: "Невероятно мягкий и теплый плед для прохладных вечеров." },
    6: { name: "Комплект льняных салфеток", price: 1990, category: "Текстиль", img: "/льняные.jpg", desc: "Набор натуральных льняных салфеток для красивой сервировки." },
    7: { name: "Деревянная доска", price: 1490, category: "Для кухни", img: "/доска.png", desc: "Экологичная деревянная доска для нарезки продуктов или подачи блюд." },
    8: { name: "Кувшин Minimal", price: 1590, category: "Для кухни", img: "/кувшин.png", desc: "Стильный кувшин для воды, лимонада или компота." },
    9: { name: "Ель искусственная на подставке", price: 1890, category: "Декор", img: "/елка.jpg", desc: "Миниатюрная ель для праздничного декора." },
    10: { name: "Бокал-кубок для шампанского", price: 2290, category: "Посуда", img: "/бокал.jpg", desc: "Элегантный бокал для особых случаев." },
    11: { name: "Скатерть 160х160 см", price: 4990, category: "Декор", img: "/скатерть.jpg", desc: "Праздничная скатерть для большого стола." },
    12: { name: "Светильник настольный 42 см", price: 5990, category: "Декор", img: "/светильник.jpg", desc: "Стильный светильник для создания уютной атмосферы." }
  };

  const product = productsData[id];

  if (!product) {
    root.innerHTML = '<p class="empty-state">Товар не найден</p>';
    return;
  }

  root.innerHTML = `
    <div class="product-detail-image">
      <img src="${product.img}" alt="${product.name}" onerror="this.src='/заглушка.png'">
    </div>
    <div class="product-detail">
      <span class="eyebrow">${product.category}</span>
      <h1>${product.name}</h1>
      <span class="price">${new Intl.NumberFormat("ru-RU").format(product.price)} ₽</span>
      <p>${product.desc}</p>
      <p>Создавайте уютные моменты каждый день вместе с HOMEY. Товар станет красивым и практичным дополнением вашего дома.</p>
      <div class="quantity-row">
        <label for="quantity">Количество</label>
        <input id="quantity" type="number" min="1" max="20" value="1">
      </div>
      <button class="btn" id="add-product">Добавить в корзину</button>
    </div>`;

  document.querySelector("#add-product").addEventListener("click", () => {
    const quantity = Math.max(1, Math.min(20, Number(document.querySelector("#quantity").value) || 1));
    
    const cartProduct = {
      id: Number(id),
      name: product.name,
      price: product.price,
      image: product.img
    };
    
    if (typeof addToCart === 'function') {
      addToCart(cartProduct, quantity);
    } else {
      console.error("Функция addToCart не найдена. Проверьте подключение app.js");
    }
  });
});