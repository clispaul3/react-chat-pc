const { remote } = window.require('electron')
const fs = window.require('fs')
export function saveImage(content){
    remote.dialog.showSaveDialog({
        filters: [{
            name: 'Images',
            extensions: ['png'],
        }]
    }, (path) => {
        if (path) {
            fs.writeFile(path, new Buffer(content, 'base64'), () => {})
        }
    })
}