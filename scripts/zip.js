let shell = require('shelljs')

const name = 'skeleton'
let files = [
    'dist/*', 'manifest.json', 'popup.html'
].join(' ')

let fileName = `${name}.zip`
// 压缩
shell.exec(`cd ./src && zip -r ${fileName} ${files} && mv ${fileName} ../`)
