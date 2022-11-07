const { mkdir, readdir, copyFile, access, unlink } = require('fs/promises');
const { constants } = require('fs');
const path = require('path');

async function copy(sourceFolder, destinationFolder) {  
  const filesInSourceFolder = await readdir(sourceFolder);  

  for (let item of filesInSourceFolder) {
    const sourceFile = path.join(sourceFolder, item);
    const dectionationFile = path.join(destinationFolder, item);

    await copyFile(sourceFile, dectionationFile);
  }  
}

async function folderExists(destinationFolder) {
  try {
    await access(destinationFolder, constants.R_OK);
    return true; 
  } catch {
    return false;
  }
}

async function copyDir() {
  const sourceFolder = path.join(__dirname, 'files');
  const destinationFolder = path.join(__dirname, 'files-copy');

  const isExist = await folderExists(destinationFolder);

  if (isExist) {
    const filesIndestinationFolder = await readdir(destinationFolder);
    for (let item of filesIndestinationFolder) {
      const dectionationFile = path.join(destinationFolder, item);
      await unlink(dectionationFile);
    }
  
  } 
  
  await mkdir(destinationFolder, {recursive: true});  

  copy(sourceFolder, destinationFolder);
}

copyDir();