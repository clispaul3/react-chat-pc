import { appKey } from '@/utils/config'
export function socket(callback){
    const wsServer = appKey=='qd46yzrfqiomf' ? 'ws://47.106.228.86:9501' : 'ws:chat.weinongtech.com:9501'
    let websocket =  new WebSocket(wsServer)
    window.$websocket = websocket
    let latestuser = localStorage.getItem('latestuser')
    websocket.onopen = (evt)=>{
        if(latestuser){
            websocket.send('{"type":"second","uuid":"'+ latestuser.split('~~~')[0] +'"}')
        }
        window.setInterval(()=>{
            websocket.send('{"type":"heartbeat"}')
        },60000)
    }
    websocket.onclose = (evt)=>{
        window.$websocket = null
        if(RongIMClient){
            RongIMClient.getInstance().disconnect()
        }
        // console.log('closed')
    }
    websocket.onmessage = (evt)=>{
        let res = eval('('+ evt.data+')')
        callback(res)
    }
}
export function closeSocket(callback){
    let timer2 = window.setTimeout(()=>{
        const user = localStorage.getItem('latestuser')
        if(window.$websocket){
            window.$websocket.close()
            window.$websocket = null
            user ? callback('2') : callback('1')
        }
        clearTimeout(timer2)
    },1800000)
}