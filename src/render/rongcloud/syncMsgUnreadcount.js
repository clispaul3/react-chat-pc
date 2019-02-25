import store from '@/store/store'
export function syncMsgUnreadcount(message){
    const { currentConversation } = store.getState()
    if(currentConversation==null){
        return
    }
    if(currentConversation.targetId!=message.targetId){
        return
    }
    let msg = {
        lastMessageSendTime: message.sentTime,
        messageUId: message.messageUId,
        type:1
    }
    msg = new RongIMLib.ReadReceiptMessage(msg)
    RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType[currentConversation.conversationType], currentConversation.targetId, msg, {
        onSuccess: function (res) {
            // console.log('同步未读数')
        },
        onError: function (err) {
            console.log(err)
        }
    })
}
