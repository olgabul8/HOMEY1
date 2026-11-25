const API = "/api";
const money = value => new Intl.NumberFormat("ru-RU").format(value) + " ₽";

function getCart() {
  try { return JSON.parse(localStorage.getItem("homey-cart")) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem("homey-cart", JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
}
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity });
  saveCart(cart);
  showToast("Товар добавлен в корзину");
}
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
function productCard(product) {
  return `
    <article class="product-card">
      <a class="product-image" href="/product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      </a>
      <div class="product-info">
        <span class="product-category">${product.category_name || ""}</span>
        <a class="product-name" href="/product.html?id=${product.id}">${product.name}</a>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" type="button" aria-label="Добавить в корзину" data-add="${product.id}">+</button>
        </div>
      </div>
    </article>`;
}
async function loadProducts(url = `${API}/products`) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Не удалось загрузить товары");
  return response.json();
}
document.addEventListener("click", async event => {
  const addButton = event.target.closest("[data-add]");
  if (!addButton) return;
  try {
    const products = await loadProducts();
    const product = products.find(item => item.id === Number(addButton.dataset.add));
    if (product) addToCart(product);
  } catch (error) { showToast(error.message); }
});
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));
});
