import JSZip from "jszip";
import { saveAs } from "file-saver";

async function addToZip(zipFolder: JSZip, folder: any) {
  //add all file url from folder
  for (const file of folder.files) {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      zipFolder.file(file.name, blob);
    } catch (err) {
      console.error(`Failed to fetch ${file.name}`, err);
    }
  }
  //add all subfolder
  for (const subfolder of folder.subfolders) {
    const subZip = zipFolder.folder(subfolder.folderName);
    if (subZip) {
      //add all file and folder inside sub folder
      await addToZip(subZip, subfolder);
    }
  }
}

export async function downloadFolder(folderTree: any) {
  const zip = new JSZip();
  const root = zip.folder(folderTree.folderName);
  if (!root) return;

  await addToZip(root, folderTree);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${folderTree.folderName}.zip`);
}
