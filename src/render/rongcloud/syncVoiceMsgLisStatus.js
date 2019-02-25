import store from '@/store/store'
export function syncVoiceMsgListenStatus(message){
    const { currentConversation,userInfo } = store.getState()
    if(currentConversation==null){
        return
    }
    if(currentConversation.targetId!=message.targetId){
        return
    }
    let msg = {
        lastMessageSendTime: message.sentTime,
        messageUId: message.messageUId,
        type:2
    }
    msg = new RongIMLib.ReadReceiptMessage(msg)
    RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType[currentConversation.conversationType], userInfo.uuid, msg, {
        onSuccess: function (res) {
            console.log('同步语音消息已听状态')
        },
        onError: function (err) {
            console.log(err)
        }
    })
}