const fs = require('fs');
const path = require('path');
const currentPath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(currentPath);

let data = '';
readStream.on('data', (chunk) => {
    data += chunk.toString();
});

readStream.on('end', () => {
    console.log(data);
});