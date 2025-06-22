import { makeDraggableResizable } from "./dragResize.js";
import { getAppContent } from "../apps.js";
import {
  addTaskbarApp,
  removeTaskbarApp,
  setActiveTaskbarApp,
} from "../Ui/taskbar.js";

let zIndexCounter = 100;
const windowState = {};

export function openWindow(app, options = {}) {
  // Prevent duplicate windows for the same app/title
  const existing = findWindowByTitle(options.title || app);
  if (existing) {
    if (windowState[existing.id].minimized) {
      existing.style.display = "";
      windowState[existing.id].minimized = false;
    }
    focusWindow(existing.id);
    return existing.id;
  }

  const container = document.getElementById("window-container");
  const id = `window-${Date.now()}`;
  const windowDiv = document.createElement("div");
  windowDiv.className = "window";
  windowDiv.id = id;
  windowDiv.setAttribute("data-window-id", id);
  windowDiv.style.zIndex = ++zIndexCounter;
  // Set initial position and size
  windowDiv.style.left = "160px";
  windowDiv.style.top = "80px";
  windowDiv.style.width = "420px";
  windowDiv.style.height = "320px";
  windowDiv.style.position = "absolute";
  windowDiv.innerHTML = `
    <div class="window-titlebar flex items-center justify-between">
      <span>${options.title || app}</span>
      <div class="flex gap-1">
        <button class="minimize" data-window-id="${id}"><i class="ri-subtract-line"></i></button>
        <button class="maximize" data-window-id="${id}"><i class="ri-checkbox-blank-line"></i></button>
        <button class="close" data-window-id="${id}"><i class="ri-close-line"></i></button>
      </div>
    </div>
    <div class="window-content p-4">${options.content || ""}</div>
  `;
  // Close button
  windowDiv.querySelector(".close").onclick = (e) => {
    e.stopPropagation();
    closeWindow(id);
  };
  // Minimize button
  windowDiv.querySelector(".minimize").onclick = (e) => {
    e.stopPropagation();
    minimizeWindow(id);
  };
  // Maximize button
  windowDiv.querySelector(".maximize").onclick = (e) => {
    e.stopPropagation();
    maximizeWindow(id);
  };
  // Focus on click
  windowDiv.onclick = () => focusWindow(id);
  container.appendChild(windowDiv);
  makeDraggableResizable(windowDiv);
  focusWindow(id);
  // Add to taskbar
  if (options.icon) {
    addTaskbarApp(app, id, options.icon);
  }
  setActiveTaskbarApp(id);

  // Store initial state
  windowState[id] = {
    minimized: false,
    maximized: false,
    prev: null,
    title: options.title || app,
  };

  // Folder/file navigation for explorer
  if (app === "explorer") {
    windowDiv
      .querySelector(".window-content")
      .addEventListener("click", (e) => {
        const target = e.target.closest("[data-type]");
        if (!target) return;
        const type = target.getAttribute("data-type");
        const folderId = target.getAttribute("data-id");
        if (type === "folder") {
          const content = getAppContent("explorer", folderId);
          windowDiv.querySelector(".window-content").innerHTML = content;
        } else if (type === "file") {
          windowDiv.querySelector(
            ".window-content"
          ).innerHTML = `<div class='p-4'>Preview of <b>${target.textContent.trim()}</b></div>`;
        }
      });
  }

  return id;
}

function findWindowByTitle(title) {
  const wins = document.querySelectorAll(".window");
  for (let win of wins) {
    const span = win.querySelector(".window-titlebar span");
    if (span && span.textContent === title) return win;
  }
  return null;
}

export function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.remove();
  removeTaskbarApp(id);
  delete windowState[id];
}

export function focusWindow(id) {
  const win = document.getElementById(id);
  if (win) win.style.zIndex = ++zIndexCounter;
  setActiveTaskbarApp(id);
}

export function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (win) {
    win.style.display = "none";
    windowState[id].minimized = true;
  }
}

export function maximizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  const state = windowState[id];
  if (!state.maximized) {
    // Store previous size/position
    state.prev = {
      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      height: win.style.height,
      position: win.style.position,
    };
    win.style.left = "0";
    win.style.top = "0";
    win.style.width = "100vw";
    win.style.height = "calc(100vh - 56px)";
    win.style.position = "fixed";
    state.maximized = true;
  } else {
    // Restore previous size/position
    if (state.prev) {
      win.style.left = state.prev.left;
      win.style.top = state.prev.top;
      win.style.width = state.prev.width;
      win.style.height = state.prev.height;
      win.style.position = state.prev.position;
    }
    state.maximized = false;
  }
}

// Listen for taskbar app click to restore minimized windows or focus by window ID
window.addEventListener("openApp", (e) => {
  const { app, title, icon, id } = e.detail;
  let win = null;
  if (id) {
    win = document.getElementById(id);
  } else {
    win = findWindowByTitle(title);
  }
  if (win) {
    const winId = win.id;
    if (windowState[winId].minimized) {
      win.style.display = "";
      windowState[winId].minimized = false;
    }
    focusWindow(winId);
  }
});
