document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#catalog-products");
  const filters = document.querySelector("#category-filters");
  const search = document.querySelector("#catalog-search");
  const sort = document.querySelector("#catalog-sort");
  
  if (!grid || !filters) return;

  const allCards = Array.from(grid.querySelectorAll(".product-card"));

  function applyFilters() {
    const activeCategory = filters.querySelector(".filter-btn.active").dataset.category;
    const searchTerm = search ? search.value.trim().toLowerCase() : "";
    const sortType = sort ? sort.value : "default";

    // Фильтрация
    allCards.forEach(card => {
      const cat = card.dataset.category;
      const name = card.dataset.name.toLowerCase();
      
      const matchCategory = (activeCategory === "all" || cat === activeCategory);
      const matchSearch = name.includes(searchTerm);

      if (matchCategory && matchSearch) {
        card.style.display = ""; 
      } else {
        card.style.display = "none"; 
      }
    });

    // Сортировка
    const visibleCards = allCards.filter(card => card.style.display !== "none");

    visibleCards.sort((a, b) => {
      const priceA = Number(a.dataset.price);
      const priceB = Number(b.dataset.price);
      const nameA = a.dataset.name;
      const nameB = b.dataset.name;

      if (sortType === "price_asc") return priceA - priceB;
      if (sortType === "price_desc") return priceB - priceA;
      if (sortType === "name") return nameA.localeCompare(nameB);
      if (sortType === "default") return 0; // Оставляем как есть в HTML
      return 0;
    });

    visibleCards.forEach(card => grid.appendChild(card));
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;
    
    filters.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    applyFilters();
  });

  if (search) search.addEventListener("input", applyFilters);
  if (sort) sort.addEventListener("change", applyFilters);
  
  applyFilters();
});