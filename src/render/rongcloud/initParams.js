import { Conversation } from '@/class/Conversation'
import store from '@/store/store'
import _ from 'lodash'
import { getConversationList } from '@/store/action'
import { handleMsgStepOne } from '@/rongcloud/messageStepOne'
import { syncMsgUnreadcount } from '@/rongcloud/syncMsgUnreadcount'
import { msgNotification } from './msgNotification'
/**
 * 部分会话中的最近一条消息体中没有targetId字段
 */
export let callbacks = {
    getInstance : function(instance){

    },
    getCurrentUser : function(userInfo){
        Conversation.getAllConversationList(list=>{
            const { friendList,groupList } = store.getState()
            let _friendList = _.map(friendList,(item)=>{
                item.targetId = item.uuid
                return item
            })
            let _groupList = _.map(groupList,(item)=>{
                item.targetId = String(item.id)
                return item
            })
			let conversationList = _.concat(_.intersectionBy(list,_friendList,'targetId'),_.intersectionBy(list,_groupList,'targetId'))
			let $conversationList = _.map(conversationList,(item)=>{
				let con = {}
                _.forEach(friendList,(friend)=>{
                    if(item.targetId==friend.uuid){
						con = {
							targetId:item.targetId,
							avatar:friend.avatar,
                            nickname:friend.remark_name || friend.nickname,
                            sentTime:item.sentTime,
							conversationType:'PRIVATE'
						}
                    }
                })
                _.forEach(groupList,(group)=>{
                    if(item.targetId==group.id){
						con = {
							targetId:item.targetId,
							avatar:group.icon,
                            nickname:group.name,
                            sentTime:item.sentTime,
							conversationType:'GROUP'
						}
                    }
                })
				return con
            })
            $conversationList = $conversationList.sort((conA,conB)=>{
                return parseInt(conB.sentTime)-parseInt(conA.sentTime)
            })
            store.dispatch(getConversationList($conversationList))
			_.forEach(conversationList,(con)=>{
				new Conversation(con).initConversation()
			})
        })
    },
    receiveNewMessage : function(message){
        handleMsgStepOne(message)
        const { messageDirection } = message
        if(messageDirection==2){
            syncMsgUnreadcount(message)
            msgNotification(message)
        }
    }
}
