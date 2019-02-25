import QRCode from '@static/lib/qrcode'
import store from '@/store/store'
import { closeSocket } from '@module/login/socket'
const { platform } = window.require('electron')
const systemInfo = platform=='win32' ? 'window' : 'mac'
export function getUserERweima(){
    const { uuid } = store.getState().userInfo
    $('#user-erweima').html('')
    let qrcode = new QRCode('user-erweima', {
        text:`jhmc://u_id/${uuid}`,
        width: 170,
        height: 170,
        colorDark : '#333000',
        colorLight : '#ffffff',
        correctLevel : QRCode.CorrectLevel.H
    })
    $('.user-erweima').addClass('fadeIn')
    $('#user-erweima').attr('title','')
    $('.user-erweima').show()
}
export function getLoginERweima(fd,callback){
    let time = Date.parse(new Date()).toString()
    $('#login-erweima').html('')
    let qrcode = new QRCode('login-erweima', {
        text:`http://chat.weinongtech.com/s?f=${fd}&t=${time.substring(0, time.length-3)}&type=${systemInfo}`,
        width: 180,
        height: 180,
        colorDark : '#333000',
        colorLight : '#ffffff',
        correctLevel : QRCode.CorrectLevel.H
    })
    $('#login-erweima').addClass('fadeIn')
    $('#login-erweima').attr('title','')
    $('#login-erweima').show()
    closeSocket(status=>{
        callback(status)
    })
}

