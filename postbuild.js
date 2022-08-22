const fs = require('node:fs');

const fileData = fs.readFileSync("dist/index.html", "utf-8")
console.log("File data : ", fileData);
const fd1 = fileData.replace('nomodule=""', '')
const fd2 = fd1.replace('<script type="module"', '<script')
console.log("After file write", fd2)
fs.writeFileSync("dist/index.html", fd2, "utf-8")