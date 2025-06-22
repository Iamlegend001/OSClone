export function makeDraggableResizable(win) {
  const titlebar = win.querySelector(".window-titlebar");
  let offsetX,
    offsetY,
    isDragging = false;
  titlebar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.body.style.userSelect = "none";
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });

  // Add resize handles
  const handles = ["nw", "ne", "sw", "se", "n", "e", "s", "w"];
  handles.forEach((dir) => {
    const handle = document.createElement("div");
    handle.className = `resize-handle resize-${dir}`;
    handle.style.position = "absolute";
    handle.style.width = handle.style.height = "12px";
    handle.style.background = "transparent";
    handle.style.zIndex = "10";
    switch (dir) {
      case "nw":
        handle.style.left = handle.style.top = "-6px";
        handle.style.cursor = "nwse-resize";
        break;
      case "ne":
        handle.style.right = handle.style.top = "-6px";
        handle.style.cursor = "nesw-resize";
        break;
      case "sw":
        handle.style.left = handle.style.bottom = "-6px";
        handle.style.cursor = "nesw-resize";
        break;
      case "se":
        handle.style.right = handle.style.bottom = "-6px";
        handle.style.cursor = "nwse-resize";
        break;
      case "n":
        handle.style.top = "-6px";
        handle.style.left = "calc(50% - 6px)";
        handle.style.cursor = "ns-resize";
        break;
      case "e":
        handle.style.right = "-6px";
        handle.style.top = "calc(50% - 6px)";
        handle.style.cursor = "ew-resize";
        break;
      case "s":
        handle.style.bottom = "-6px";
        handle.style.left = "calc(50% - 6px)";
        handle.style.cursor = "ns-resize";
        break;
      case "w":
        handle.style.left = "-6px";
        handle.style.top = "calc(50% - 6px)";
        handle.style.cursor = "ew-resize";
        break;
    }
    win.appendChild(handle);
    let isResizing = false,
      startX,
      startY,
      startW,
      startH,
      startL,
      startT;
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = win.offsetWidth;
      startH = win.offsetHeight;
      startL = win.offsetLeft;
      startT = win.offsetTop;
      document.body.style.userSelect = "none";
      function onMove(ev) {
        if (!isResizing) return;
        let dx = ev.clientX - startX;
        let dy = ev.clientY - startY;
        let newW = startW,
          newH = startH,
          newL = startL,
          newT = startT;
        if (dir.includes("e")) newW = Math.max(300, startW + dx);
        if (dir.includes("s")) newH = Math.max(200, startH + dy);
        if (dir.includes("w")) {
          newW = Math.max(300, startW - dx);
          newL = startL + dx;
        }
        if (dir.includes("n")) {
          newH = Math.max(200, startH - dy);
          newT = startT + dy;
        }
        win.style.width = newW + "px";
        win.style.height = newH + "px";
        win.style.left = newL + "px";
        win.style.top = newT + "px";
      }
      function onUp() {
        isResizing = false;
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });
}
