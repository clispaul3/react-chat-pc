import { MessageType } from '@/rongcloud/messageType'
import { DOMController } from '@/class/DOMController'
export class TransmitMessage {
    constructor(msgList,conList){
        this.messageList = msgList
        this.conversationList = conList
        this.permitMsg = ['RC:TxtMsg','RC:ImgMsg','RC:FileMsg','RC:SightMsg','RCBQMM:GifMsg',
            'RCBQMM:EmojiMsg','WY:ShareLinkContentMessage','RC:StkMsg']
        this.init()
    }
    init(){
        DOMController.showModalBox([{selector:'.modal-no-transmit-message',display:'block'}])
        for(let i=0;i<this.messageList.length;i++){
            for(let j=0;j<this.conversationList.length;j++){
                this.sendInterval({
                    msgIdx:i+1,
                    conIdx:j+1
                })
            }
        }
    }
    sendInterval(params){
        const { msgIdx,conIdx } = params
        const time = 300 * ( msgIdx * conIdx - 1)
        let timer = window.setTimeout(()=>{
            this.sendMessage(this.messageList[msgIdx-1],this.conversationList[conIdx-1])
            clearTimeout(timer)
        },time)
    }
    sendMessage(msg,con){
        const { objectName } = msg
        let params = {}
        if(this.permitMsg.indexOf(objectName)>=0){
            params.conversationType = con.icon ? 'GROUP' : 'PRIVATE'
            params.targetId = con.icon ? con.id : con.uuid
            if(objectName=='RC:TxtMsg'){
                params.msg = new RongIMLib.TextMessage({content:msg.content.content,extra:"转发消息"})
            }
            if(objectName=='RC:ImgMsg'){
                params.msg = new RongIMLib.ImageMessage({content:msg.content.content,imageUri:msg.content.imageUri,extra:"转发消息"})
            }
            if(objectName=='RC:FileMsg'){
                const { name, fileUrl, size, type } = msg.content
                params.msg = new RongIMLib.FileMessage({name:name,fileUrl:fileUrl,size:size,type,extra:"转发消息"})
            }
            if(objectName=='WY:ShareLinkContentMessage'){
                params.msg = new RongIMClient.RegisterMessage.LinkCard(msg.content)
            }
            if(objectName=='RC:StkMsg'){
                params.msg = new RongIMClient.RegisterMessage.RongStickerMessage(msg.content)
            }
            if(objectName=='RCBQMM:EmojiMsg' ){
                params.msg = new RongIMClient.RegisterMessage.StickerEmojiMessage(msg.content)
            }
            if(objectName=='RCBQMM:GifMsg'){
                params.msg = new RongIMClient.RegisterMessage.StickerGifMessage(msg.content)
            }
            if(objectName=='RC:SightMsg'){
                params.msg = new RongIMClient.RegisterMessage.SightMessage(msg.content)
            }
            this.rongcloudSend(params)
        }else{
        }
    }
    rongcloudSend(params){
        const { conversationType,targetId,msg } = params
        RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType[conversationType], String(targetId), msg, {
            onSuccess: function (message) {
                new MessageType(message,'pc-receive')
            },
            onError: function (errorCode,message) {
            }
        })
    }
}