import store from '@/store/store'
import _ from 'lodash'
import { clearConMessageList,updateConversationLatestMsg } from '@/store/action'
export function clearConHistoryMsg(targetId){
	const { conversationList,currentConversation } = store.getState()
	const conversation = _.find(conversationList,(con)=>String(con.targetId)==String(targetId))
	if(conversation){
		const type = conversation.conversationType
		let params = {
			conversationType: RongIMLib.ConversationType[type],
			targetId: String(targetId),
			timestamp: conversation.sentTime
		}
		RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
				onSuccess: function() {
					if(currentConversation){
						if(currentConversation.targetId==targetId){
							store.dispatch(clearConMessageList())
						}
					}
					store.dispatch(updateConversationLatestMsg(targetId,''))
					console.log('清除成功',targetId)
				},
				onError: function(error) {
					console.log('清除失败')
				}
		})
	}else{
		console.log('会话不存在，无法删除历史消息')
	}
}
export function clearAllHistoryMsg(){
    let list = store.getState().conversationList
    _.forEach(list,(item)=>{
        clearConHistoryMsg(item.targetId)
    })
}
