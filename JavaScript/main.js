import { initDesktop } from "./Core/os.js";
import { initTaskbar } from "./Ui/taskbar.js";
import { setTheme, loadWallpaper } from "./Ui/settings.js";
import { openWindow } from "./Core/windowManager.js";
import { getAppContent } from "./apps.js";

document.addEventListener("DOMContentLoaded", () => {
  setTheme("light");
  loadWallpaper();
  initDesktop();
  initTaskbar();

  // Handle openApp event from taskbar
  window.addEventListener("openApp", async (e) => {
    const { app, title, icon, id } = e.detail;
    let content =
      '<div class="flex items-center justify-center h-64"><i class="ri-loader-4-line animate-spin text-3xl text-blue-400"></i></div>';
    if (app === "explorer" || app === "recycle") {
      content = await getAppContent(app, id);
    }
    openWindow(app, { title, content, icon });
  });
});
