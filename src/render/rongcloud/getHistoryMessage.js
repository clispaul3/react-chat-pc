import store from '@/store/store'
import _ from 'lodash'
/**
 * timestrap:默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
 */
export function getHistoryMessage(targetId,timestrap){
	return new Promise((resolve,reject)=>{
		const conversation = _.find(store.getState().conversationList,(con)=>con.targetId==targetId)
		if(conversation){
			const conversationType = RongIMLib.ConversationType[conversation.conversationType]
			const count = 20
			RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, String(targetId), timestrap, count, {
				onSuccess: function(list, hasMsg) {
					resolve({list, hasMsg})
				},
				onError: function(error) {
					console.log("GetHistoryMessages,errorcode:" + targetId)
				}
			})
		}else{
			console.log('未找到会话，无法获取历史消息')
		}
	})
}
