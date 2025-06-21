class WindowManager {
  constructor(desktop) {
    this.desktop = desktop;
    this.windows = new Map();
    this.zIndexCounter = 1000;
  }

  createWindow({
    id,
    title,
    body,
    width = "30rem",
    height = "30rem",
    top = "10rem",
    left = "10rem",
  }) {
    if (this.windows.has(id)) {
      this.focusWindow(id);
      return;
    }

    const windowDiv = document.createElement("div");
    windowDiv.className = "app-window";
    windowDiv.id = id;
    windowDiv.style.width = width;
    windowDiv.style.height = height;
    windowDiv.style.top = top;
    windowDiv.style.left = left;

    windowDiv.innerHTML = `
      <div class="window-header">
        <span>${title}</span>
        <button class="close-btn">×</button>
      </div>
      <div class="window-body">
        ${body}
      </div>
    `;

    this.desktop.appendChild(windowDiv);
    this.windows.set(id, windowDiv);

    this.focusWindow(id);

    windowDiv.querySelector(".close-btn").addEventListener("click", () => {
      this.closeWindow(id);
    });

    this.makeDraggable(windowDiv);
  }

  closeWindow(id) {
    const windowDiv = this.windows.get(id);
    if (windowDiv) {
      windowDiv.remove();
      this.windows.delete(id);
    }
  }

  focusWindow(id) {
    const windowDiv = this.windows.get(id);
    if (windowDiv) {
      windowDiv.style.zIndex = ++this.zIndexCounter;
    }
  }

  makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;
    const header = element.querySelector(".window-header");

    header.onmousedown = (e) => {
      isDragging = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
      this.focusWindow(element.id);
    };

    document.onmousemove = (e) => {
      if (!isDragging) return;
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    };

    document.onmouseup = () => {
      isDragging = false;
    };
  }

  loadDesktopIcons() {
    const icon = document.createElement("div");
    icon.className = "desktop-icon";
    icon.innerHTML = `
      <img src="./assets/Icons/folder1.png" width="48" /><br/>
      <span>My Files</span>
    `;
    icon.style.position = "absolute";
    icon.style.top = "1.5rem";
    icon.style.left = "1.5rem";
    icon.style.textAlign = "center";
    icon.style.color = "white";
    icon.style.cursor = "pointer";

    icon.ondblclick = () => {
      this.createWindow({
        id: "fileWindow",
        title: "File Explorer",
        body: "<div>Welcome to File Manager</div>",
      });
    };

    this.desktop.appendChild(icon);
  }
}
