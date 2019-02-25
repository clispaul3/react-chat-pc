const { shell } = window.require('electron')
export class AppSetting{
    constructor(){

    }
    // 打开链接
    static openURL(str){
        if(str=='在线客服'){
            shell.openExternal('http://html.ecqun.com/kf/sdk/openwin.html?corpid=4082467&cstype=rand&mode=0&cskey=2fgF8VQsVvx8HU2PJD&scheme=0')
        }
        if(str=='官方网站'){
            shell.openExternal('http://9.weinongtech.com')
        }
        if(str=='服务协议'){
            shell.openExternal('http://www.weinongtech.com/promise.html')
        }
    }
}