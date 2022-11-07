const path = require('path')
const fs = require('fs')

const stylesPath = path.join(__dirname, "styles")
const bundlePath = path.join(__dirname, "project-dist", "bundle.css")

async function createBundle() {
  const files = await getCssFiles(stylesPath)
  packAllToBundle(bundlePath, files)
}

const getCssFiles = async (dir) => new Promise((resolve, reject) => {
  fs.readdir(dir, {withFileTypes: true}, (err, files) => {
    if(err) return reject(err)
    resolve (
      files
        .filter(file => file.isFile())
        .filter(file => path.extname(file.name) == '.css')
        .map(file => path.join(dir, file.name))
    )
  })
});

const packAllToBundle = async (bundleFile, files) => {
  const wStream = fs.createWriteStream(bundleFile)
  files.forEach(file => {
    const rStream = fs.createReadStream(file)
    rStream.pipe(wStream)
  });
}

//run this
createBundle()