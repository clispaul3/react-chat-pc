// 创建系统托盘
const  mainProcess  = require('../main.js')
const { Tray,app,ipcMain } = require('electron')
const path = require('path')
function createTray(){
    const { mainWindow } = mainProcess.mainwindow
    let tray = new Tray(path.join(__dirname,'../assets/logo-small.png'))
    ipcMain.on('unread-total-count',(ev,count)=>{
      if(count>0){
        if(count>99){
          tray.setTitle(String('99+'))
          app.dock.setBadge(String('99+'))
        }else{
          tray.setTitle(String(count))
          app.dock.setBadge(String(count))
        }
      }else{
        app.dock.setBadge(String(''))
        tray.setTitle('')
      }
    })
    tray.on('click',()=>{
      if(mainWindow){
        mainWindow.show()
      }
    })
}
exports.createTray = createTray