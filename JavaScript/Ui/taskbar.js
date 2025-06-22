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
        <i id="wifi-icon" class="ri-wifi-fill text-lg cursor-pointer"></i>
        <i id="battery-icon" class="ri-battery-2-fill text-lg cursor-pointer"></i>
        <i id="sound-icon" class="ri-volume-up-fill text-lg cursor-pointer"></i>
        <span class="ml-2 text-xs">99%</span>
        <div id="taskbar-clock" class="px-3 py-1 rounded glass text-sm cursor-pointer"></div>
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

  // Calendar popup logic
  const clock = document.getElementById("taskbar-clock");
  const calendar = document.getElementById("calendar-popup");
  clock.onclick = (e) => {
    e.stopPropagation();
    renderCalendar(calendar);
    calendar.classList.toggle("hidden");
  };
  document.addEventListener("click", (e) => {
    if (!calendar.classList.contains("hidden")) {
      calendar.classList.add("hidden");
    }
  });
  calendar.addEventListener("click", (e) => e.stopPropagation());

  // Quick Settings Panel logic
  const quickPanel = document.getElementById("quick-settings-panel");
  function toggleQuickPanel(e) {
    e.stopPropagation();
    renderQuickSettings(quickPanel);
    quickPanel.classList.toggle("hidden");
  }
  document.getElementById("wifi-icon").onclick = toggleQuickPanel;
  document.getElementById("battery-icon").onclick = toggleQuickPanel;
  document.getElementById("sound-icon").onclick = toggleQuickPanel;
  document.addEventListener("click", () => {
    if (!quickPanel.classList.contains("hidden"))
      quickPanel.classList.add("hidden");
  });
  quickPanel.addEventListener("click", (e) => e.stopPropagation());
}

function renderCalendar(container) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push("");
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  container.innerHTML = `
    <div class="glass rounded-xl shadow-xl p-4 w-80">
      <div class="flex justify-between items-center mb-2">
        <span class="font-semibold text-lg text-white">${now.toLocaleString(
          "default",
          { month: "long" }
        )} ${year}</span>
        <i class="ri-calendar-2-line text-xl text-white"></i>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-white">
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        ${days.map((d) => `<div class="py-1">${d ? d : ""}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderQuickSettings(container) {
  container.innerHTML = `
    <div class="glass rounded-xl shadow-xl p-4 w-[380px]">
      <div class="grid grid-cols-3 gap-2 mb-3">
        <button class="bg-blue-500/80 text-white rounded-lg flex flex-col items-center py-2"><i class="ri-wifi-fill text-2xl mb-1"></i><span class="text-xs">Available</span></button>
        <button class="bg-blue-500/80 text-white rounded-lg flex flex-col items-center py-2"><i class="ri-bluetooth-fill text-2xl mb-1"></i><span class="text-xs">Not connected</span></button>
        <button class="bg-gray-700/40 text-white rounded-lg flex flex-col items-center py-2"><i class="ri-flight-mode-line text-2xl mb-1"></i><span class="text-xs">Airplane mode</span></button>
        <button class="bg-gray-700/40 text-white rounded-lg flex flex-col items-center py-2"><i class="ri-leaf-fill text-2xl mb-1"></i><span class="text-xs">Energy saver</span></button>
        <button class="bg-gray-700/40 text-white rounded-lg flex flex-col items-center py-2"><i class="ri-moon-clear-fill text-2xl mb-1"></i><span class="text-xs">Night light</span></button>
        <button class="bg-gray-700/40 text-white rounded-lg flex flex-col items-center py-2"><i class="ri-accessibility-line text-2xl mb-1"></i><span class="text-xs">Accessibility</span></button>
      </div>
      <div class="border-t border-white/10 my-2"></div>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <i class="ri-sun-line text-xl text-white"></i>
          <input id="brightness-slider" type="range" min="10" max="100" value="100" class="flex-1 accent-blue-500" />
        </div>
        <div class="flex items-center gap-2">
          <i class="ri-volume-up-line text-xl text-white"></i>
          <input id="volume-slider" type="range" min="0" max="100" value="100" class="flex-1 accent-blue-500" />
        </div>
      </div>
      <div class="flex items-center justify-between mt-4">
        <span class="flex items-center gap-1 text-green-400"><i class="ri-battery-2-fill"></i>99%</span>
        <i class="ri-settings-3-line text-xl text-white cursor-pointer"></i>
      </div>
    </div>
  `;
  // Brightness slider demo: adjust wallpaper brightness
  const brightness = container.querySelector("#brightness-slider");
  brightness.oninput = (e) => {
    document.getElementById(
      "desktop-bg"
    ).style.filter = `brightness(${e.target.value}%)`;
  };
  // Volume slider demo: just a UI effect (no real sound)
  const volume = container.querySelector("#volume-slider");
  volume.oninput = (e) => {
    // You can hook this to a real audio element if needed
  };
}
