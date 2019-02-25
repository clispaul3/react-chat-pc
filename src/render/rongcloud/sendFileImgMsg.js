import store from '../store/store'
import $ from 'jquery'
import { MessageType } from '@/rongcloud/messageType'
export class SendFileImgMsg{
    constructor(params){
        this.conversationType = RongIMLib.ConversationType[params.conversationType]
        this.targetId = params.targetId
        this.file = params.file
        if(params.file.type.indexOf('image')>=0){
            this.sendImageMsg()
        }else{
            this.sendFileMsg()
        }
    }

    // 发送图片
    sendImageMsg(){
        let msg = new RongIMLib.ImageMessage({
            content:this.file.base64.split(',')[1],
            imageUri:'http://jhmcimg.weinongtech.com/' + this.file.url
        })
        RongIMClient.getInstance().sendMessage(this.conversationType, this.targetId, msg, {
            onSuccess:(message)=> {
                new MessageType(message,'pc-receive')
                // this.updateState('ImageMessage', message)
            },
            onError:(error)=>{
                console.log(error)
            }
        })
    }
    
    // 发送文件
    sendFileMsg(){
        let msg = new RongIMLib.FileMessage({ 
            name: this.file.name, 
            size: this.file.size, 
            type: this.file.type, 
            fileUrl: this.file.url
        })
        RongIMClient.getInstance().sendMessage(this.conversationType, this.targetId, msg, {
            onSuccess: (message)=>{
                console.log(message)
                new MessageType(message,'pc-receive')
                // this.updateState('FileMessage', message)
            },
            onError: (error)=>{
                console.log(error)
            }
        })
    }

    // 更新页面状态
    updateState(str, message){
        store.commit('getSendedMessage',{
            list:message,
            str:'new'
        })
        let type = new MessageType(message).checkMsgType()
        let latestMsg = {
            targetId:this.targetId,
            messageType:str,
            content:{
                content:type ? type.content : ''
            },
            sentTime:new Date().getTime()
        }

        store.commit('addUnreadCount', latestMsg)

        // 更新DOM
        $('.not-empty-msg').hide()
        $('.not-file-msg').show().text('发送完毕 !')
        window.uploadTargetId = 0
        let timer1 = window.setTimeout(()=>{
            $('.not-file-msg').hide()
            clearTimeout(timer1)
        },2000)
        $('#talkarea .right .middle').scrollTop($('#talkarea .right .middle')[0].scrollHeight)
        let timer = window.setTimeout(()=>{
            $('#talkarea .right .middle').scrollTop($('#talkarea .right .middle')[0].scrollHeight)
            clearTimeout(timer)
        },300)
    }
}
