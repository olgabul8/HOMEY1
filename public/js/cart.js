document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("#cart-items");
  const summary = document.querySelector("#cart-summary");
  const checkout = document.querySelector("#checkout-form");
  if (!list) return;

  const imagesMap = {
    1: "/тарелка.png",
    2: "/чашка.png",
    3: "/ваза.png",
    4: "/свеча.png",
    5: "/плед.png",
    6: "/льняные.jpg",
    7: "/доска.png",
    8: "/кувшин.png",
    9: "/елка.jpg",
    10: "/бокал.jpg",
    11: "/скатерть.jpg",
    12: "/светильник.jpg"
  };

  function render() {
    const cart = getCart();
    if (!cart.length) {
      list.innerHTML = '<div class="empty-state"><h3>Ваша корзина пока пуста</h3><p>Добавьте товары, которые сделают ваш дом уютнее.</p><a class="btn" href="/catalog.html">Перейти в каталог</a></div>';
      summary.hidden = true;
      return;
    }
    summary.hidden = false;
    list.innerHTML = cart.map(item => {
      const imgSrc = imagesMap[item.id] || "/заглушка.png";
      
      return `
      <div class="cart-item">
        <img src="${imgSrc}" alt="${item.name}" onerror="this.src='/заглушка.png'">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <div class="cart-item-controls">
            <span class="cart-item-price">${money(item.price)}</span>
            <span class="cart-item-qty">
              <button type="button" class="qty-btn" data-change="${item.id}" data-step="-1">−</button>
              <span class="qty-num">${item.quantity}</span>
              <button type="button" class="qty-btn" data-change="${item.id}" data-step="1">+</button>
            </span>
            <button type="button" class="remove-btn" data-remove="${item.id}">Удалить</button>
          </div>
        </div>
        <strong class="cart-item-total">${money(item.price * item.quantity)}</strong>
      </div>`;
    }).join("");
    document.querySelector("#cart-total").textContent = money(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }

  list.addEventListener("click", event => {
    const change = event.target.closest("[data-change]");
    const remove = event.target.closest("[data-remove]");
    let cart = getCart();
    if (change) {
      const item = cart.find(p => p.id === Number(change.dataset.change));
      if (item) item.quantity += Number(change.dataset.step);
      cart = cart.filter(item => item.quantity > 0);
    }
    if (remove) cart = cart.filter(item => item.id !== Number(remove.dataset.remove));
    saveCart(cart);
    render();
  });

  checkout.addEventListener("submit", async event => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) return;
    const data = Object.fromEntries(new FormData(checkout).entries());
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, items: cart, total })
    });
    const result = await response.json();
    const status = document.querySelector("#checkout-message");
    if (!response.ok) {
      status.textContent = result.message || "Не удалось оформить заказ";
      return;
    }
    status.textContent = `${result.message}. Номер заказа: ${result.orderId}`;
    saveCart([]);
    render();
    checkout.reset();
  });
  render();
});