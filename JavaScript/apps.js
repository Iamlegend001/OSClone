const dummyFiles = {
  "this-pc": [
    { name: "Documents", type: "folder", id: "documents" },
    { name: "Pictures", type: "folder", id: "pictures" },
    { name: "Readme.txt", type: "file", id: "readme" },
  ],
  documents: [
    { name: "Project.docx", type: "file", id: "project-doc" },
    { name: "Notes.txt", type: "file", id: "notes" },
  ],
};

export function getAppContent(app, id) {
  if (app === "explorer") {
    const files = dummyFiles[id] || [];
    return `<div class='flex flex-col gap-2'>${files
      .map(
        (f) =>
          `<div class='p-2 rounded hover:bg-blue-100 cursor-pointer' data-type='${
            f.type
          }' data-id='${f.id}'>${f.type === "folder" ? "📁" : "📄"} ${
            f.name
          }</div>`
      )
      .join("")}</div>`;
  }
  if (app === "recycle") {
    return `<div class='text-center text-gray-500'>Recycle Bin is empty.</div>`;
  }
  return `<div class='text-center'>App not implemented.</div>`;
}
