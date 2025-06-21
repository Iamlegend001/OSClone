// Make windowManager a global instance
let windowManager;

function initOs() {
  console.log("⚙️ Initializing OS...");

  const desktop = document.getElementById("desktop");
  windowManager = new WindowManager(desktop);

  setDefaultWallpaper();
  windowManager.loadDesktopIcons();
  setupTaskbar();
}
