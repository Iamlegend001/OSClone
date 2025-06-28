import { showContextMenu } from "../Ui/contextMenu.js";
import { openWindow } from "./windowManager.js";
import { getAppContent } from "../apps.js";

export function initDesktop() {
  const desktop = document.getElementById("desktop-icons");
  // Example icons
  const icons = [
    {
      name: "This PC",
      icon: "assets/Icons/folder1.png",
      app: "explorer",
      id: "this-pc",
    },
    {
      name: "Recycle Bin",
      icon: "assets/Icons/folder1.png",
      app: "recycle",
      id: "recycle-bin",
    },
    {
      name: "Documents",
      icon: "assets/Icons/folder1.png",
      app: "explorer",
      id: "documents",
    },
    {
      name: "Terminal",
      icon: "assets/Icons/terminal.png",
      app: "terminal",
      id: "terminal",
    },
  ];
  desktop.innerHTML = icons
    .map(
      (icon) => `
    <div class="desktop-icon group flex flex-col items-center m-4 cursor-pointer select-none" data-app="${icon.app}" data-id="${icon.id}" data-icon="${icon.icon}" id="${icon.id}">
      <img src="${icon.icon}" class="w-12 h-12 mb-1 transition-transform group-hover:scale-110" draggable="false" />
      <span class="text-xs text-center">${icon.name}</span>
    </div>
  `
    )
    .join("");
  // Right-click context menu
  desktop.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, "desktop");
  });
  // Double-click to open window
  desktop.querySelectorAll(".desktop-icon").forEach((icon) => {
    icon.addEventListener("dblclick", async (e) => {
      const app = icon.getAttribute("data-app");
      const id = icon.getAttribute("data-id");
      const iconPath = icon.getAttribute("data-icon");
      const title = icon.querySelector("span").textContent;
      console.log("Double-clicked icon:", { app, id, iconPath, title });
      let content =
        '<div class="flex items-center justify-center h-64"><i class="ri-loader-4-line animate-spin text-3xl text-blue-400"></i></div>';
      if (app === "explorer") {
        // Show loading spinner, then fetch template
        const winId = openWindow(app, { title, content, icon: iconPath });
        console.log("Called openWindow for explorer, winId:", winId);
        content = await getAppContent(app, id);
        // Update window content after fetch
        const win = document.getElementById(winId);
        if (win) {
          win.querySelector(".window-content").innerHTML = content;
          console.log("Updated window content for winId:", winId);
        } else {
          console.warn("Window not found for winId:", winId);
        }
      } else {
        content = await getAppContent(app, id);
        openWindow(app, { title, content, icon: iconPath });
      }
    });
  });
}
