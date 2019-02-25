import store from '@/store/store'
/**
 * @params
 * packageId,stickerId,digest
 **/
export function sendGifMessage(params){
    const { currentConversation } = store.getState()
    if(!currentConversation) return
    const { conversationType, targetId } = currentConversation
    params = Object.assign(params,{height:40,width:40})
    var msg = new RongIMClient.RegisterMessage.StickerMessage(params)
    RongIMClient.sendMessage(RongIMLib.ConversationType[conversationType], targetId, msg, {
    onSuccess: function(message) {
            console.log(message)
        },
        onError: function(error, message) {
            console.log(error)
        }
    })
}