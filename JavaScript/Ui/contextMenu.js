export function showContextMenu(x, y, type) {
  const menu = document.getElementById("context-menu");
  let items = [];
  if (type === "desktop") {
    items = [
      { label: "View", action: () => {} },
      { label: "Sort by", action: () => {} },
      { label: "Refresh", action: () => location.reload() },
      { label: "Personalize", action: () => {} },
    ];
  }
  menu.innerHTML = items
    .map(
      (item) =>
        `<div class='px-4 py-2 hover:bg-blue-100 cursor-pointer'>${item.label}</div>`
    )
    .join("");
  menu.style.left = x + "px";
  menu.style.top = y + "px";
  menu.classList.remove("hidden");
  // Hide on click elsewhere
  document.addEventListener("click", () => menu.classList.add("hidden"), {
    once: true,
  });
}
