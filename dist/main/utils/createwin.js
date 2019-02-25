const { BrowserWindow,app }  = require('electron')
const { platform } = require('os')
class CreateWindow{
    constructor(params){
        this.loadurl = params.url
        this.mainWindow = null
        this.init()
        this.loadURL()
    }
    // 初始化
    init(){
        let mainWindow = null
        mainWindow = new BrowserWindow({
            minHeight: 524,
            minWidth:856,
            useContentSize:true,
            show:false,
            frame:false,
            autoHideMenuBar:true,
            webSecurity:false,
            titleBarStyle:'hidden',
            webPreferences:{
                devTools:(this.loadurl.indexOf('localhost')>=0) ? true : false
            }
        })
        if(platform()=='darwin'){
            mainWindow.simpleFullscreen = true
        }
        this.mainWindow = mainWindow
    }
    // 加载页面
    loadURL(){
        this.mainWindow.loadURL(this.loadurl)
        this.mainWindow.on('ready-to-show',()=>{
            this.mainWindow.show()
        })
        this.mainWindow.on('close', (event) => {
            event.preventDefault()
            this.mainWindow.minimize()
        })
    }
    // 设置窗口大小
    setSize(route){
        if(route=='index'){
            const { width } = require('electron').screen.getPrimaryDisplay().workAreaSize
            this.mainWindow.setResizable(true)
            if(platform()=='darwin'){
                this.mainWindow.setSize(parseInt(width*0.5),parseInt(width*0.3),true)
            }
            if(platform()=='win32'){
                this.mainWindow.setSize(parseInt(width*0.5),parseInt(width*0.3))
            }
        }
        if(route=='login'){
            this.mainWindow.setSize(856,524)
            this.mainWindow.setResizable(false)
        }
    }
    // 打开控制台
    openDevtools(){
        this.mainWindow.webContents.openDevTools()
    }
}
module.exports = CreateWindow
