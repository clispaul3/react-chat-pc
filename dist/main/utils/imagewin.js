const { BrowserWindow }  = require('electron')
const path = require('path')
function imagewin(list,idx){
    if(global.$imagewindow){
        global.$imagewindow.webContents.send('image-list',list,idx)
        global.$imagewindow.on('close',()=>{
            global.$imagewindow = null
        })
    }else{
        global.$imagewindow = new BrowserWindow({
            height: 753,
            width:500,
            useContentSize:true,
            show:false,
            frame:false,
            autoHideMenuBar:true,
            webSecurity:false,
            titleBarStyle:'default',
        })
        global.$imagewindow.on('close',()=>{
            global.$imagewindow = null
        })
        global.$imagewindow.loadURL(`file://${path.join(__dirname,'../../html/imageContainer.html')}`)
        global.$imagewindow.on('ready-to-show',()=>{
            global.$imagewindow.show()
            global.$imagewindow.openDevTools()
            global.$imagewindow.webContents.send('image-list',list,idx)
        })
    }
}
module.exports = {
    imagewin
}