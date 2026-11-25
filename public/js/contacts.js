document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const message = document.querySelector("#contact-message");
    const data = Object.fromEntries(new FormData(form).entries());
    message.textContent = "Отправляем...";
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка отправки");
      message.textContent = result.message;
      form.reset();
    } catch (error) {
      message.textContent = error.message;
    }
  });
});
