const dummyFiles = {
  "this-pc": [
    {
      name: "Windows (C:)",
      type: "drive",
      id: "drive-c",
      icon: "ri-hard-drive-2-fill",
      used: 349,
      total: 952,
    },
    { name: "TeraBox", type: "app", id: "terabox", icon: "ri-apps-2-fill" },
  ],
  documents: [
    { name: "Project.docx", type: "file", id: "project-doc" },
    { name: "Notes.txt", type: "file", id: "notes" },
  ],
};

export async function getAppContent(app, id) {
  if (app === "explorer") {
    if (id === "this-pc") {
      // Fetch the explorer.html template
      try {
        const res = await fetch("explorer.html");
        if (!res.ok) throw new Error("Failed to load explorer.html");
        return await res.text();
      } catch (e) {
        return `<div class='p-8 text-center text-red-400'>Failed to load File Explorer UI.</div>`;
      }
    }
    // fallback for other folders
    const files = dummyFiles[id] || [];
    return Promise.resolve(
      `<div class='flex flex-col gap-2'>${files
        .map(
          (f) =>
            `<div class='p-2 rounded hover:bg-blue-100 cursor-pointer' data-type='${
              f.type
            }' data-id='${f.id}'>${f.type === "folder" ? "📁" : "📄"} ${
              f.name
            }</div>`
        )
        .join("")}</div>`
    );
  }
  if (app === "recycle") {
    return Promise.resolve(
      `<div class='text-center text-gray-500'>Recycle Bin is empty.</div>`
    );
  }
  return Promise.resolve(`<div class='text-center'>App not implemented.</div>`);
}
