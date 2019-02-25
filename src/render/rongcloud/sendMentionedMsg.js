import { MessageType } from '@/rongcloud/messageType'
export function sendMentionedMsg(targetId,content,userIdList,type){
    const conversationtype = RongIMLib.ConversationType.GROUP
    let mentioneds = new RongIMLib.MentionedInfo()
    mentioneds.type = RongIMLib.MentionedType[type]
    mentioneds.userIdList = userIdList
    const msg = new RongIMLib.TextMessage({
        content,
        extra:"@ message",
        mentionedInfo:mentioneds
    })
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
        onSuccess: function (message) {
            window.$mentionedFriends = []
            new MessageType(message,'pc-receive')
            let timer = window.setTimeout(()=>{
                window.scrollMessageList.scrollToBottom()
                clearTimeout(timer)
              },100)
            console.log("Send @msg successfully")
        },
        onError: function (errorCode,message) {
            console.log('发送失败:' + errorCode)
        }
    },true)
}
