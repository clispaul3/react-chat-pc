const { BrowserWindow }  = require('electron')
const path = require('path')
function videowin(sigthurl){
    if(global.$videowindow){
        global.$videowindow.webContents.send('set-url',sigthurl)
        global.$videowindow.on('close',()=>{
            global.$videowindow = null
        })
    }else{
        global.$videowindow = new BrowserWindow({
            height: 753,
            width:500,
            useContentSize:true,
            show:false,
            frame:false,
            autoHideMenuBar:true,
            webSecurity:false,
            titleBarStyle:'hidden',
        })
        global.$videowindow.on('close',()=>{
            global.$videowindow = null
        })
        global.$videowindow.loadURL(`file://${path.join(__dirname,'../../html/videoContainer.html')}`)
        global.$videowindow.on('ready-to-show',()=>{
            global.$videowindow.show()
            global.$videowindow.webContents.send('sight-url',sigthurl)
        })
    }
}
module.exports = {
    videowin
}