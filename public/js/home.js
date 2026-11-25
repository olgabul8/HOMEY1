document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("#featured-products");
  if (!grid) return;
  try {
    const products = await loadProducts();
    grid.innerHTML = products.slice(0, 4).map(productCard).join("");
  } catch {
    grid.innerHTML = '<p class="empty-state">Не удалось загрузить товары. Обновите страницу.</p>';
  }
});
