const { readdir, stat } = require('fs/promises');
const path = require('path');

async function readInFolder() {
  const folderPath = path.join(__dirname, 'secret-folder');
  try {
    const files = await readdir(folderPath);

    for (let item of files) {
      const filePath = path.join(folderPath, item);

      const fileStat = await stat(filePath);

      if (fileStat.isFile()) {
        let fileExtension = path.extname(filePath);
        const fileName = path.basename(filePath, fileExtension);    
        fileExtension = path.extname(filePath).slice(1);   
        const fileSize = fileStat.size;
        const result = `${fileName} - ${fileExtension} - ${fileSize}b`;
        process.stdout.write(result + '\n');
      }

    }
  } catch (err) {
    process.stdout.write("error in 3rd task");
  }
}

readInFolder();