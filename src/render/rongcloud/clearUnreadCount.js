import store from '@/store/store'
import _ from 'lodash'
export function clearUnreadCount(targetId){
    const conversation = _.find(store.getState().conversationList,(con)=>con.targetId==targetId)
    if(conversation==undefined){
        return
    }
    var clearUnreadCount = RongIMClient.getInstance().clearUnreadCount
    const conversationType = RongIMLib.ConversationType[conversation.conversationType]
    clearUnreadCount(conversationType, targetId, {
        onSuccess: function () {
			// console.log('清除未读数成功',targetId)
        },
        onError: function (errorCode) {
			console.log('清除未读数失败',targetId)
        }
    })
}