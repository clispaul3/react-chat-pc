import React, { Component } from 'react'
import style_handlemenu from './handleMenu.scss'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Friend } from '@/class/Friend'
import store from '@/store/store'
import { deleteOneFriendRequest, getFriendInfo, getGroupInfo,
    updateConversationIstop,updateConversationNotips,toggleCheckboxStatus,
    toggleMultipleStatus,deleteOneConversation} from '@/store/action'
import { DOMController } from '@/class/DOMController'
import { entryOfSendMsg } from '@/public/entryOfSendMsg'
import { Group } from '@/class/Group';
import { RegisterMessage } from '@/rongcloud/registerMessage'
import conversation_db from '@/localdb/conversation'
import { MsgContextmenu } from './messageContextmenu'
import { clearConHistoryMsg } from '@/rongcloud/clearHistoryMsg'
import { clearUnreadCount } from '@/rongcloud/clearUnreadCount'
import { deleteConversation } from '@/rongcloud/deleteConversation'
/**
 * @props
 * contextmenu
 */
export class HandleMenu extends Component{
    constructor(props){
        super(props)
    }
    deleteFriendRequest(ready_id){
        Friend.deleteFriendRequest(ready_id,3).then(res=>{
            store.dispatch(deleteOneFriendRequest(ready_id))
            DOMController.closeAllModalBox()
        })
    }
    sendMessage(contextmenuObj){
        if(_.has(contextmenuObj,'icon')){
            entryOfSendMsg(contextmenuObj.id,'GROUP')
        }
        if(_.has(contextmenuObj,'uuid')){
            entryOfSendMsg(contextmenuObj.uuid,'PRIVATE')
        }
        DOMController.closeAllModalBox()
    }
    showInfo(contextmenuObj){
        if(_.has(contextmenuObj,'icon')){
            Group.getGroupInfo(contextmenuObj.id).then(res=>{
                store.dispatch(getGroupInfo(res))
                DOMController.showModalBox([{selector:'.group-info-right',display:'block'}])
            })
        }
        if(_.has(contextmenuObj,'uuid')){
            Friend.getFriendInfo(contextmenuObj.uuid).then(res=>{
                store.dispatch(getFriendInfo(res))
                DOMController.showModalBox([{selector:'#user-info',display:'block'}])
            })
        }
    }
    deleteFriend(contextmenuObj){
        const { userInfo } = store.getState()
        Friend.deleteFriend(contextmenuObj.uuid).then(res=>{
            RegisterMessage.handleFriend({
                backUpMsg:'删除好友',
                handleType:4,
                receiverUUID:contextmenuObj.uuid,
                senderAvatar:userInfo.avatar,
                senderUUID:userInfo.uuid,
                senderNickName:userInfo.nickname,
            },'WY:FriendNotification')
        })
    }
    quitGroup(operation,contextmenuObj){
        if(operation=='解散群组'){
            Group.deleteGroup({id:contextmenuObj.id},res=>{
                DOMController.closeAllModalBox()
            })
        }
        if(operation=='退出群组'){
            const { userInfo } = store.getState()
            Group.quitGroup({id:contextmenuObj.id,friends:userInfo.uuid},res=>{
                DOMController.closeAllModalBox()
            })
        }
    }
    setConversationTop(contextmenuObj){
        const { userInfo } = store.getState()
        conversation_db.set_top({
            conId:userInfo.uuid + '~~~' + contextmenuObj.targetId,
            isTop:contextmenuObj.isTop=='1' ? '0' : '1'
        },res=>{
            if(res.rowsAffected>=1){
                DOMController.closeAllModalBox()
                store.dispatch(updateConversationIstop(contextmenuObj.targetId,contextmenuObj.isTop=='1' ? '0' : '1'))
            }
        })
    }
    setConversationNoTips(contextmenuObj){
        const { userInfo } = store.getState()
        conversation_db.set_tips({
            conId:userInfo.uuid + '~~~' + contextmenuObj.targetId,
            noTips:contextmenuObj.noTips=='1' ? '0' : '1'
        },res=>{
            if(res.rowsAffected>=1){
                DOMController.closeAllModalBox()
                store.dispatch(updateConversationNotips(contextmenuObj.targetId,contextmenuObj.noTips=='1' ? '0' : '1'))
            }
        })
    }
    deleteConversation(contextmenuObj){
        const { targetId,conversationType } = contextmenuObj
        clearConHistoryMsg(targetId)
        clearUnreadCount(targetId)
        deleteConversation(targetId,conversationType)
        store.dispatch(deleteOneConversation(targetId))
        DOMController.closeAllModalBox()
    }
    operateMessage(contextmenuObj,operation){
        DOMController.closeAllModalBox()
        switch(operation){
            case '保存':
                MsgContextmenu.saveFileImg(contextmenuObj)
            case '复制':
                MsgContextmenu.copyMsg(contextmenuObj)
                break
            case '撤回':
                MsgContextmenu.withdrawMsg(contextmenuObj)
                break
            case '删除':
                MsgContextmenu.deleteMsg(contextmenuObj)
                break
            case '多选':
                if(store.getState().multipleStatus==1){
                    return
                }
                store.dispatch(toggleMultipleStatus(1))
                const { messageUId,sentTime } = contextmenuObj
                store.dispatch(toggleCheckboxStatus(messageUId,sentTime,true))
                break
            case '转发':
                DOMController.showModalBox([{selector:'.container-transmit-message',display:'block'}])
                window.$transmitMulMsg = 0
                break
            case '转文字':
                MsgContextmenu.voiceToText(contextmenuObj)
                break
            case '收起文字':
                MsgContextmenu.hideVcText(contextmenuObj)
                break
            default:
                break
        }
    }
    copyTextareaContent(){
        DOMController.closeAllModalBox()
        MsgContextmenu.copyMsg()
        console.log('copy')
    }
    pastContent(){
        MsgContextmenu.pasteContent()
        DOMController.closeAllModalBox()
    }
    renderHtmlMenu(){
        if(this.props.contextmenu){
            const { contextmenuObj } = this.props.contextmenu
            if(Object.keys(contextmenuObj).indexOf('conversationType')>=0){
                if(contextmenuObj.conversationType=='PRIVATE' || contextmenuObj.conversationType=='GROUP'){
                    return <ul>
                        <li onClick={this.setConversationTop.bind(this,contextmenuObj)}>{contextmenuObj.isTop=='1' ? '取消置顶' : '会话置顶'}</li>
                        <li onClick={this.setConversationNoTips.bind(this,contextmenuObj)}>{contextmenuObj.noTips=='1' ? '开启新消息提醒' : '消息免打扰'}</li>
                        <li onClick={this.deleteConversation.bind(this,contextmenuObj)}>删除会话</li>
                    </ul>
                }
            }
            if(Object.keys(contextmenuObj).indexOf('textarea')>=0){
                return <ul>
                    <li onClick={this.copyTextareaContent.bind(this)}>复制</li>
                    <li onClick={this.pastContent.bind(this)}>粘贴</li>
                </ul>
            }
            if(Object.keys(contextmenuObj).indexOf('messageUId')>=0){
                const menu = new MsgContextmenu(contextmenuObj).contextmenu()
                if(menu){
                    return <ul>{menu.map((item,idx) => <li key={idx} onClick={this.operateMessage.bind(this,contextmenuObj,item)}>{item}</li>)}</ul>
                }
            }
            if(Object.keys(contextmenuObj).indexOf('icon')>=0){
                const { userInfo } = store.getState()
                const operation = contextmenuObj.owner == userInfo.uuid ? '解散群组' : '退出群组'
                return <ul>
                    <li onClick={this.sendMessage.bind(this,contextmenuObj)}>发消息</li>
                    <li onClick={this.showInfo.bind(this,contextmenuObj)}>查看资料</li>
                    <li onClick={this.quitGroup.bind(this,operation,contextmenuObj)}>{operation}</li>
                </ul>
            }
            if(Object.keys(contextmenuObj).indexOf('uuid')>=0){
                return <ul>
                    <li onClick={this.sendMessage.bind(this,contextmenuObj)}>发消息</li>
                    <li onClick={this.showInfo.bind(this,contextmenuObj)}>查看资料</li>
                    <li onClick={this.deleteFriend.bind(this,contextmenuObj)}>删除好友</li>
                </ul>
            }
            if(Object.keys(contextmenuObj).indexOf('ready_id')>=0){
                return <ul>
                    <li onClick={this.deleteFriendRequest.bind(this,contextmenuObj.ready_id)}>删除</li>
                </ul>
            }
        }
    }
    render(){
        return <div className={'handle-menu'}>
            {this.renderHtmlMenu.bind(this)()}
        </div>
    }
}
const mapState = (state)=>{return {contextmenu:state.contextmenu}}
export default connect (mapState)(HandleMenu)