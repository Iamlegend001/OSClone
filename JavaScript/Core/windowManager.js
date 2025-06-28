import { getAppContent } from "../apps.js";

export function openWindow(app, options = {}) {
  const { title = app, icon = "", content = "" } = options;

  // If window already exists, focus it
  const existingWindow = document.querySelector(`.window[data-app="${app}"]`);
  if (existingWindow) {
    existingWindow.style.zIndex = getNextZIndex();
    existingWindow.classList.remove("minimized");
    return existingWindow.id;
  }

  const windowDiv = document.createElement("div");
  windowDiv.className = "window";
  windowDiv.dataset.app = app;
  windowDiv.style.zIndex = getNextZIndex();
  windowDiv.id = `window-${app}-${Date.now()}`;

  windowDiv.innerHTML = `
    <div class="window-titlebar">
      <span class="window-icon">${icon}</span>
      <span class="window-title">${title}</span>
      <div class="window-controls">
        <button class="minimize">_</button>
        <button class="maximize">▢</button>
        <button class="close">×</button>
      </div>
    </div>
    <div class="window-content">Loading...</div>
  `;

  const container =
    document.getElementById("window-container") || document.body;
  container.appendChild(windowDiv);

  // Load app content
  loadAppContent(windowDiv, app);

  // Drag functionality (optional but assumed in your UI)
  makeWindowDraggable(windowDiv);

  // Controls
  const closeBtn = windowDiv.querySelector(".close");
  const minimizeBtn = windowDiv.querySelector(".minimize");
  const maximizeBtn = windowDiv.querySelector(".maximize");

  closeBtn.addEventListener("click", () => windowDiv.remove());
  minimizeBtn.addEventListener("click", () => {
    windowDiv.classList.add("minimized");
  });
  maximizeBtn.addEventListener("click", () => {
    if (windowDiv.classList.contains("maximized")) {
      windowDiv.classList.remove("maximized");
      windowDiv.style.left = windowDiv.dataset.prevLeft || "";
      windowDiv.style.top = windowDiv.dataset.prevTop || "";
      windowDiv.style.width = windowDiv.dataset.prevWidth || "";
      windowDiv.style.height = windowDiv.dataset.prevHeight || "";
    } else {
      windowDiv.dataset.prevLeft = windowDiv.style.left;
      windowDiv.dataset.prevTop = windowDiv.style.top;
      windowDiv.dataset.prevWidth = windowDiv.style.width;
      windowDiv.dataset.prevHeight = windowDiv.style.height;
      windowDiv.classList.add("maximized");
      windowDiv.style.left = 0;
      windowDiv.style.top = 0;
      windowDiv.style.width = "100vw";
      windowDiv.style.height = "calc(100vh - 56px)";
    }
  });

  // Focus on click
  windowDiv.addEventListener("mousedown", () => {
    windowDiv.style.zIndex = getNextZIndex();
    windowDiv.classList.remove("minimized");
  });

  return windowDiv.id;
}

// Set z-index incrementally
let zIndexCounter = 100;
function getNextZIndex() {
  return ++zIndexCounter;
}

async function loadAppContent(windowDiv, app, folderId = null) {
  const contentDiv = windowDiv.querySelector(".window-content");

  contentDiv.innerHTML = `<div class="flex items-center justify-center h-32">
    <i class="ri-loader-4-line animate-spin text-3xl text-blue-500"></i>
  </div>`;

  try {
    const content = await getAppContent(app, folderId);
    contentDiv.innerHTML = content;

    if (app === "explorer") {
      bindExplorerEvents(windowDiv);
    }
  } catch (error) {
    contentDiv.innerHTML = `<div class="p-4 text-red-500 text-center">Failed to load content</div>`;
    console.error("App Load Error:", error);
  }
}

function bindExplorerEvents(windowDiv) {
  const contentDiv = windowDiv.querySelector(".window-content");

  contentDiv.addEventListener("click", async (e) => {
    const target = e.target.closest("[data-type]");
    if (!target) return;

    const type = target.getAttribute("data-type");
    const id = target.getAttribute("data-id");

    if (type === "folder") {
      await loadAppContent(windowDiv, "explorer", id);
    } else if (type === "file") {
      contentDiv.innerHTML = `<div class='p-4'>Preview of <b>${target.textContent.trim()}</b></div>`;
    }
  });
}

function makeWindowDraggable(windowDiv) {
  let isDragging = false;
  let offsetX, offsetY;

  const titlebar = windowDiv.querySelector(".window-titlebar");
  titlebar.style.cursor = "move";

  titlebar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - windowDiv.offsetLeft;
    offsetY = e.clientY - windowDiv.offsetTop;
    windowDiv.style.position = "absolute";
    windowDiv.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      windowDiv.style.left = `${e.clientX - offsetX}px`;
      windowDiv.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    windowDiv.style.userSelect = "auto";
  });
}
