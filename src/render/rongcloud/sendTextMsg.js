import store from '@/store/store'
import { MessageType } from '@/rongcloud/messageType'
import { sendMentionedMsg } from '@/rongcloud/sendMentionedMsg'
export class SendTextMessage {
  constructor(content){
    this.currentConversation = store.getState().currentConversation
    this.content = RongIMLib.RongIMEmoji.symbolToEmoji(content)
    this.textContent = content
  }
  sendMsg(){
    let nameArr = this.textContent.match(/@\S+/g,'@')
    if(nameArr!=null && this.currentConversation.conversationType=='GROUP'){
      this.findMentionedFriends(nameArr)
    }else{
      this.sendTextmsg()
    }
  }
  sendTextmsg(){
    const msg = new RongIMLib.TextMessage({content:this.content})
    const { conversationType,targetId } = this.currentConversation
    const conType = RongIMLib.ConversationType[conversationType]
    RongIMClient.getInstance().sendMessage(conType, String(targetId), msg, {
      onSuccess: function (message) {
          new MessageType(message,'pc-receive')
          console.log("Send successfully")
          let timer = window.setTimeout(()=>{
            window.scrollMessageList.scrollToBottom()
            clearTimeout(timer)
          },100)
      },
      onError: function (errorCode,message) {
          console.log('发送失败:' + errorCode)
      }
    })
  }
  findMentionedFriends(nameArr){
    let userIdList = []
    if(nameArr.indexOf('@所有人')>=0){
      for(let item of store.getState().groupInfo.members){
        userIdList.push(item.uuid)
      }
      sendMentionedMsg(this.currentConversation.targetId,this.textContent,userIdList,'ALL')
      return
    }
    for(let item of nameArr){
      for(let mem of window.$mentionedFriends){
        if(item == ("@"+mem.nickname)){
          userIdList.push(mem.uuid)
        }
      }
    }
    if(userIdList.length==0){
      this.sendTextmsg()
    }else{
      sendMentionedMsg(this.currentConversation.targetId,this.textContent,userIdList,'PART')
    }
  }
}
