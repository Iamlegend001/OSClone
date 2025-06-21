function setupTaskbar() {
  const taskbar = document.getElementById("taskbar");
  const desktop = document.getElementById("desktop");

  // Taskbar HTML
  taskbar.innerHTML = `
    <div class="taskbar-left">
      <div class="weather-widget" id="weatherWidget">
        <i class="ri-sun-cloudy-line weather-icon"></i>
        <span class="weather-temp">28°C</span>
        <span class="weather-cond">Haze</span>
      </div>
    </div>
    <div class="taskbar-center">
      <img src="./assets/Icons/Start1.png" id="startBtn" class="taskbar-icon" alt="Start" title="Start" />
      <div class="search-box" id="searchBox">
        <i class="ri-search-line"></i>
        <span>Search</span>
      </div>
      <img src="./assets/Icons/folder1.png" id="fileIcon" class="taskbar-icon" alt="File Explorer" title="File Explorer" />
      <img src="./assets/Icons/terminal.png" id="terminalIcon" class="taskbar-icon" alt="Terminal" title="Terminal" />
    </div>
    <div class="taskbar-right">
      <div class="system-tray">
        <i class="ri-wifi-line" title="Wi-Fi"></i>
        <i class="ri-volume-up-line" title="Sound"></i>
        <i class="ri-battery-2-fill" title="Battery"></i>
        <div id="clock" class="taskbar-clock"></div>
      </div>
    </div>
  `;

  // Start Menu Popup
  let startMenu = document.getElementById("startMenu");
  if (!startMenu) {
    startMenu = document.createElement("div");
    startMenu.id = "startMenu";
    startMenu.className = "start-menu hidden";
    startMenu.innerHTML = `<div>Start Menu Content</div>`;
    desktop.appendChild(startMenu);
  }

  // Search Popup
  let searchWindow = document.getElementById("searchWindow");
  if (!searchWindow) {
    searchWindow = document.createElement("div");
    searchWindow.id = "searchWindow";
    searchWindow.className = "search-window hidden";
    searchWindow.innerHTML = `
      <div class="search-header">
        <input type="text" placeholder="Search apps, settings, files..." />
      </div>
      <div class="search-content">
        <div class="search-section">
          <h3>Recent</h3>
          <div class="search-items"></div>
        </div>
      </div>`;
    desktop.appendChild(searchWindow);
  }

  // Clock
  function updateClock() {
    const now = new Date();
    const clock = document.getElementById("clock");
    clock.innerText = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Event Listeners
  document.getElementById("startBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("hidden");
    searchWindow.classList.add("hidden");
  });

  document.getElementById("searchBox").addEventListener("click", (e) => {
    e.stopPropagation();
    searchWindow.classList.toggle("hidden");
    startMenu.classList.add("hidden");
  });

  desktop.addEventListener("click", () => {
    startMenu.classList.add("hidden");
    searchWindow.classList.add("hidden");
  });

  document.getElementById("fileIcon").addEventListener("click", () => {
    windowManager.createWindow({
      id: "fileWindow",
      title: "File Explorer",
      body: "<div>Welcome to File Manager</div>",
    });
  });

  document.getElementById("terminalIcon").addEventListener("click", () => {
    windowManager.createWindow({
      id: "terminalWindow",
      title: "Terminal",
      body: `<div class=\"terminal-body\" style=\"background-color: #000; color: #0f0; height: 100%; font-family: monospace; padding: 5px;\">C:\\Users\\Guest&gt;</div>`,
    });
  });
}
