const {resolve, extname} = require('path')
const {readFile, writeFile, mkdir, readdir, copyFile, unlink} = require('fs/promises')
const {createReadStream, createWriteStream} = require('fs')

const distPath = resolve(__dirname, 'project-dist')
const componentsPath = resolve(__dirname, 'components')
const templateHtmlPath = resolve(__dirname, 'template.html')
const pathToStyles = resolve(__dirname, 'styles')
const pathToBundleStyles = resolve(distPath, 'style.css')
const pathToAssets = resolve(__dirname, 'assets')

function copyDir(sourcePath, distPath) {

  let fileList = []
  return mkdir(distPath, {recursive: true})
    .then(() => readdir(sourcePath, {withFileTypes: true}))
    .then(data => {
      return Promise.all(data.map(el => {
        fileList.push(el)
        if (el.isFile()) {
          return copyFile(resolve(sourcePath, el.name),
            resolve(distPath, el.name))
        } else {
          return copyDir(resolve(sourcePath, el.name), resolve(distPath, el.name))
        }
      }))
    }).then(() => readdir(distPath, {withFileTypes: true}))
    .then(newFiles => newFiles
      .forEach(newFile => {
        if (!fileList.find(el => el.name === newFile.name))
          unlink(resolve(distPath, newFile.name))
      })
    )
}

function mergeStyles(stylesPath, bundlePath) {
  return readdir(stylesPath, {withFileTypes: true}).then(data => data.filter(el =>
    el.isFile() && extname(resolve(stylesPath, el.name)) === '.css'))
    .then(res => Promise.all(res.map(file => new Promise(resol => {
      let data = ''
      const readStream = createReadStream(resolve(stylesPath, file.name))
      readStream.on('data', chunk => {
        data += chunk
      })
      readStream.on('end', () => {
        data += '\r\n'
        resol(data)
      })
    }))))
    .then(data => {
      const bundle = createWriteStream(bundlePath)
      bundle.on('error', err => {
        console.error(err)
      })
      data.forEach((el) => {
        bundle.write(el)
      })
    })
    .then(() => {
      console.log('bundle created')
    })
}

function replaceToComponent(path, matches, idx, template) {
  if (matches.length - 1 === idx) {
    return readFile(resolve(path, matches[idx][1] + '.html'), 'utf-8')
      .then(component => {
        return template.replace(matches[idx][0], component)
      })
  } else return readFile(resolve(path, matches[idx][1] + '.html'), 'utf-8')
    .then(component => {
      let newTepm = template.replace(matches[idx][0], component)
      return replaceToComponent(path, matches, idx + 1, newTepm)
    })
}

readFile(templateHtmlPath, 'utf-8')
  .then(template => {
    const matches = Array.from(template.matchAll(/{{(.*?)}}/g))
    return replaceToComponent(componentsPath, matches, 0, template)
  })
  .then(result => {
    return mkdir(distPath, {recursive: true})
      .then(() => writeFile(resolve(distPath, 'index.html'), result))
  })
  .then(() => mergeStyles(pathToStyles, pathToBundleStyles))
  .then(()=>{
    return copyDir(pathToAssets, resolve(distPath, 'assets'))
  })
  .then(()=>{
    console.log('done')
  })