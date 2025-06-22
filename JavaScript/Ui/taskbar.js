let openApps = [];
let activeWindowId = null;

const pinnedApps = [
  {
    app: "explorer",
    icon: "<i class='ri-folder-3-fill text-2xl'></i>",
    title: "Explorer",
  },
  {
    app: "terminal",
    icon: "<i class='ri-terminal-box-fill text-2xl'></i>",
    title: "Terminal",
  },
];

export function addTaskbarApp(app, id, icon) {
  if (!openApps.some((a) => a.id === id)) {
    openApps.push({ app, id, icon });
    updateTaskbarApps();
  }
}

export function removeTaskbarApp(id) {
  openApps = openApps.filter((a) => a.id !== id);
  updateTaskbarApps();
}

export function setActiveTaskbarApp(id) {
  activeWindowId = id;
  updateTaskbarApps();
}

function updateTaskbarApps() {
  const appsContainer = document.getElementById("taskbar-apps");
  if (!appsContainer) return;
  // For each pinned app, check if it's open and active
  appsContainer.innerHTML = pinnedApps
    .map((pinned) => {
      const open = openApps.find((a) => a.app === pinned.app);
      const isActive = open && open.id === activeWindowId;
      return `
      <div class="relative flex flex-col items-center">
        <button class="w-10 h-10 flex items-center justify-center rounded ${
          isActive ? "bg-white/10" : "hover:bg-white/20"
        } transition taskbar-pinned" data-app="${pinned.app}" data-icon="${
        pinned.icon
      }" ${open ? `data-window-id="${open.id}"` : ""}>
          ${pinned.icon}
        </button>
        <div class="h-1 mt-1 w-2 rounded-full ${
          open ? "bg-blue-500" : ""
        }"></div>
      </div>
    `;
    })
    .join("");
  // Add click listeners to pinned app buttons
  appsContainer.querySelectorAll(".taskbar-pinned").forEach((btn) => {
    btn.onclick = () => {
      const app = btn.getAttribute("data-app");
      const icon = btn.getAttribute("data-icon");
      const winId = btn.getAttribute("data-window-id");
      // If already open, focus it
      if (winId) {
        window.dispatchEvent(
          new CustomEvent("openApp", {
            detail: {
              app,
              title: pinnedApps.find((p) => p.app === app).title,
              icon,
              id: winId,
            },
          })
        );
      } else {
        // Open new window
        window.dispatchEvent(
          new CustomEvent("openApp", {
            detail: {
              app,
              title: pinnedApps.find((p) => p.app === app).title,
              icon,
            },
          })
        );
      }
    };
  });
}

export function initTaskbar() {
  const taskbar = document.getElementById("taskbar");
  taskbar.innerHTML = `
    <div id="taskbar-inner">
      <div class="taskbar-left">
        <div class="flex items-center gap-2 px-3 py-1 rounded glass text-sm">
          <i class="ri-cloudy-fill text-xl"></i>
          <span>31°C</span>
          <span class="text-xs text-blue-600">Heavy rain</span>
        </div>
      </div>
      <div class="taskbar-center">
        <button id="start-btn" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition">
          <i class="ri-windows-fill text-2xl"></i>
        </button>
        <div class="flex items-center bg-white/10 px-4 py-1 rounded-full glass min-w-[180px] max-w-[260px]">
          <i class="ri-search-line text-lg mr-2 opacity-70"></i>
          <span class="text-gray-700 dark:text-gray-200 opacity-70 text-sm">Search web & PC</span>
        </div>
        <div id="taskbar-apps" class="flex items-center gap-1 ml-2"></div>
      </div>
      <div class="taskbar-right">
        <i class="ri-wifi-fill text-lg"></i>
        <i class="ri-battery-2-fill text-lg"></i>
        <i class="ri-volume-up-fill text-lg"></i>
        <span class="ml-2 text-xs">99%</span>
        <div id="taskbar-clock" class="px-3 py-1 rounded glass text-sm"></div>
      </div>
    </div>
  `;
  // Clock
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = now.toLocaleDateString();
    document.getElementById("taskbar-clock").textContent = `${time} | ${date}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
  updateTaskbarApps();
}
