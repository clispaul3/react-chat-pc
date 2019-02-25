import { getHistoryMessage } from '@/rongcloud/getHistoryMessage'
import store from '@/store/store'
import { updateConversationSentTime,updateConversationLatestMsg,updateConversationSenderName,
    updateConversationUnreadCount,addOneConversation,addGroup,addFriend } from '@/store/action'
import { MessageType } from '@/rongcloud/messageType'
import { Friend } from '@/class/Friend'
import { Group } from '@/class/Group'
import async from 'async'
export class Conversation{
    constructor(conversation){
		this.conversation = conversation || null
    }
    static getAllConversationList(callback){
			// console.time('list')
			RongIMClient.getInstance().getConversationList({
				onSuccess: function(list) {
					// console.timeEnd('list')
					callback(list)
				},
				onError: function(error) {}
			},null)
    }
	initConversation(){
		const { targetId,unreadMessageCount } = this.conversation
		this.conversation.latestMessage.targetId = targetId
		getHistoryMessage(targetId,0).then(res=>{
			if(res.list.length>0){
				const { sentTime } = this.conversation
				if((window.$loginTime-sentTime)<=1000*60*60*24*5){
					store.dispatch(updateConversationUnreadCount(targetId,unreadMessageCount))
				}
				new MessageType(res.list[res.list.length-1],'login')
			}else{
				store.dispatch(updateConversationSentTime(targetId,0))
				store.dispatch(updateConversationUnreadCount(targetId,0))
			}
		})
	}
	/**
	 * 1) 通过收到融云消息判断是否创建会话(message)
	 * 2) 通过好友信息或者群信息中发消息的入口创建会话(send-message)
	 */

	static createConversation(targetId,conversationType,callback){
		if(conversationType=='PRIVATE'){
			let newConversation = {targetId,conversationType,unreadCount:0,senderName:'',latestMsg:''}
			const existFriend = _.find(store.getState().friendList, item => item.targetId == targetId)
			if(existFriend){
				newConversation = Object.assign(newConversation,{nickname:existFriend.nickname,avatar:existFriend.avatar})
				callback(newConversation)
			}else{
				Friend.getFriendInfo(targetId).then(info=>{
					newConversation = Object.assign(newConversation,{nickname:info.nickname,avatar:info.avatar})
					callback(newConversation)
				})
			}
		}
		if(conversationType=='GROUP'){
			targetId = String(targetId)
			let newConversation = {targetId,conversationType,unreadCount:0}
			const existGroup = _.find(store.getState().groupList, item => item.targetId == targetId)
			if(existGroup){
				newConversation = Object.assign(newConversation,{nickname:existGroup.name,avatar:existGroup.icon}),
				callback(newConversation)
			}else{
				Group.getGroupInfo(targetId).then(info=>{
					newConversation = Object.assign(newConversation,{nickname:info.group_info.name,avatar:info.group_info.icon})
					callback(newConversation)
				})
			}
		}
		console.log('新建会话')
	}
}
