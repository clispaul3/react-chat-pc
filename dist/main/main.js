const { app } = require('electron')
const CreatreWindow = require('./utils/createwin')
const { listenIpcMain } = require('./utils/listenIpcMain')
const { existOnlyoneApp } = require('./utils/onlyOneApp')
const path = require('path')
const screenCapture = require('./utils/screenCapture')
const urlArr = [
    {id:1,url:'http://localhost:3000/index.html'},
    {id:2,url:`file://${path.resolve(__dirname,'../../dist')}/index.html`},
]
const params = urlArr['bash-production'.indexOf('dev')>=0 ? 0 : 1]
exports.loadurl = params.url
app.on('ready',()=>{
    global.name = 'java'
    if(params.id==2){
        screenCapture.useCapture()
    }
    const mainwindow =  new CreatreWindow(params)
    exports.mainwindow = mainwindow
    listenIpcMain(mainwindow)
    existOnlyoneApp(mainwindow)
})
app.on('before-quit',(ev)=>{
    app.quit()
})
app.on('quit',()=>{
    app.quit()
})
