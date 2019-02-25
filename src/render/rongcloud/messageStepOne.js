/**
 * @params
 *  对消息的第一步处理：是否 增加/删除 会话
 **/
import { MessageType } from './messageType'
import { Conversation } from '@/class/Conversation'
import { Group } from '@/class/Group'
import store from '@/store/store'
import _ from 'lodash'
import { deleteOneConversation,deleteGroup,addFriend,
    addGroup,addOneConversation,toggleCurrentConversation } from '@/store/action'
import { clearConHistoryMsg } from '@/rongcloud/clearHistoryMsg'
export function handleMsgStepOne(message){
    // console.log(message)
    const { objectName,targetId,conversationType } = message
    const { conversationList,currentConversation } = store.getState()
    const userUuid = store.getState().userInfo.uuid
    const existCon = _.find(conversationList,item => item.targetId == targetId)
    const showLogo = ()=>{
        if(existCon){
            store.dispatch(deleteOneConversation(targetId))
            if(currentConversation){
                if(currentConversation.targetId==targetId){
                    store.dispatch(toggleCurrentConversation(null))
                    $('.logo-image').show()
                }
            }
        }
    }
    let conditionType = true
    // 删除会话类消息-->更新通讯录
    if(objectName=='RC:GrpNtf'){
        const { operation } = message.content
        if(operation=='Dismiss'){
            conditionType = false
            showLogo()
            store.dispatch(deleteGroup(targetId))
        }
        if(operation=='Quit'){
            const { operatorUserId } = message.content
            if(operatorUserId==userUuid){
                store.dispatch(deleteGroup(targetId))
                clearConHistoryMsg(targetId)
                showLogo()
            }
        }
    }
    if(objectName=='WY:FriendNotification'){
        const { handleType } = message.content
        if(handleType==1){
            conditionType = false
            Friend.getNewFriendLsit(1).then(res=>{})
        }
    }
    // 增加会话类消息-->更新通讯录
    if(objectName=='WY:FriendHandle'){
        conditionType = false
        Conversation.createConversation(targetId,'PRIVATE',newCon=>{
            store.dispatch(addOneConversation(newCon))
            new MessageType(message,'pc-receive')
            Friend.getFriendInfo(targetId).then(info=>{
                store.dispatch(addFriend(info))
            })
            Friend.getNewFriendLsit(1).then(res=>{})
        })
    }
    // 增加会话类消息-->更新通讯录
    if(objectName=='RC:GrpNtf'){
        const { operation } = message.content
        let create = operation=='Create' ? true : false
        if(operation=='Add'){
            const { targetUserIds } = message.content.data
            if(targetUserIds.indexOf(userUuid)>=0){
                create = true
            }
        }
        if(create){
            conditionType = false
            Conversation.createConversation(targetId,'GROUP',newCon=>{
                store.dispatch(addOneConversation(newCon))
                new MessageType(message,'pc-receive')
                Group.getGroupInfo(targetId).then(info=>store.dispatch(addGroup(info.group_info)))
            })
        }
    }
    // 增加会话类消息-->不更新通讯录
    if(conditionType){
        if(existCon==undefined){
            conditionType = false
            if(conversationType==1){
                Conversation.createConversation(targetId,'PRIVATE',newCon=>{
                    store.dispatch(addOneConversation(newCon))
                    new MessageType(message,'pc-receive')
                })
            }
            if(conversationType==3){
                Conversation.createConversation(targetId,'GROUP',newCon=>{
                    store.dispatch(addOneConversation(newCon))
                    new MessageType(message,'pc-receive')
                })
            }
        }
    }
    // 不增加会话-->只更新会话中的字段
    if(conditionType){
        new MessageType(message,'pc-receive')
    }
}