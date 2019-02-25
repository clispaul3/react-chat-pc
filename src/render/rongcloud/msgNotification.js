/**
 * @condition
 * platform messageDirection noTips window.$newMsgNotice
 * mainwindIstop
**/
const { platform } = window.require('os')
const { remote } = window.require('electron')
import store from '@/store/store'
import _ from 'lodash'
import { toggleCurrentConversation } from '@/store/action'
export function msgNotification(message){
    const mainWin = remote.getCurrentWindow()
    if(mainWin.isFocused() || platform=='win32' || window.$newMsgNotice==false){
        return
    }
    const { targetId } = message
    const { conversationList } = store.getState()
    const timer = window.setTimeout(()=>{
        const conversation = _.find(conversationList,item=>item.targetId==targetId)
        if(conversation==undefined){
            return
        }
        if(conversation.noTips!='1'){
            let myNotification = new Notification(conversation.nickname, {
                body: conversation.latestMsg,
                icon:conversation.avatar
            })
            myNotification.onclick = ()=>{
                store.dispatch(toggleCurrentConversation(conversation))
            }
        }
        clearTimeout(timer)
    },300)
}
