// 设置工具栏菜单
const { app,Menu,shell } = require('electron')
const mainProcess = require('../main')
const _ = require('lodash')
function createMenu(route){
  let template = [
    {
      label: '窗口',
      submenu: [
        { label: '最小化',role:'minimize'},
        { label:'打开',click(){
            const { mainWindow } = mainProcess.mainwindow
            if(mainWindow){
                mainWindow.show()
            }
        }},
        { label:'窗口置顶',click(item,win){
            if(win){
              win.setAlwaysOnTop(true)
            }
        }},
        { label:'取消置顶',click(item,win){
          if(win){
            win.setAlwaysOnTop(false)
          }
        }}
      ]
    },
    {
      label:'帮助',
      role: 'help',
      submenu: [
        {
          label: '在线客服',
          click () { 
            shell.openExternal('http://html.ecqun.com/kf/sdk/openwin.html?corpid=4082467&cstype=rand&mode=0&cskey=2fgF8VQsVvx8HU2PJD&scheme=0')
          }
        },{
          label: '官网网站',
          click(){
            shell.openExternal('http://www.weinongtech.com/index2.html')
          }
        }
      ]
    }
  ]
  if(route=='index'){
    let pageIndexMenu = [{ label: '全屏',role:'toggleFullScreen' },{label:'缩放',role:'zoom'}]
    template[0].submenu = _.concat(pageIndexMenu,template[0].submenu)
    if(mainProcess.loadurl.indexOf('localhost')>=0){
      template[0].submenu.push({ label:'开发者工具',role:'toggledevtools'})
    }
  }
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label:'关于9号米仓',role: 'about' },
        { label:'版本号' + app.getVersion() },
        // { label: '检查更新',
        //     click:()=>{
        //         console.log('new-version')
        //     } 
        // },
        { label: '退出',role:'quit' },
      ]
    })
  }
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}
module.exports = {
    createMenu
}
