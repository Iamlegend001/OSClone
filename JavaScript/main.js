import { initDesktop } from "./Core/os.js";
import { initTaskbar } from "./Ui/taskbar.js";
import { setTheme, loadWallpaper } from "./Ui/settings.js";
import { openWindow } from "./Core/windowManager.js";

document.addEventListener("DOMContentLoaded", () => {
  setTheme("light"); // default theme
  loadWallpaper();
  initDesktop();
  initTaskbar();
  // Add more initializations as needed
});

window.addEventListener("openApp", (e) => {
  const { app, title, icon } = e.detail;
  openWindow(app, { title, icon, content: "" });
});
