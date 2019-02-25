import React from 'react'
import { UserPortrait } from '@base/userPortrait/userportrait'
import { getHistoryMessage } from '@/rongcloud/getHistoryMessage'
import { clearUnreadCount } from '@/rongcloud/clearUnreadCount'
import { formatTime } from '@/utils/formatTime'
import { toggleCurrentConversation,getGroupInfo,updateConversationUnreadCount,
  clearConMessageList,updateConversationLatestMsg,contextmenuObj,contextmenuEvent } from '@/store/action'
import store from '@/store/store'
import _ from 'lodash'
import { MessageType } from '@/rongcloud/MessageType'
import { Group } from '@/class/Group'
import { FriendIdentity } from '@/public/friendIdentity'
import { syncMsgUnreadcount } from '@/rongcloud/syncMsgUnreadcount'
import { closeTimerInterval } from '@/utils/voiceLoadtimer'
/**
 * 切换当前会话的入口：1）点击某个会话 2）点击发消息的入口  其他方式都不能切换当前会话，不通过接收消息切换当前会话
 */
export class Conversation extends React.Component{
	constructor(props){
			super(props)
	}
	componentDidMount(){
		this.refs.current.onmousemove = function(ev){
			ev.preventDefault()
		}
	}
	toggleConversation(ev){
		closeTimerInterval()
	  const { targetId } = this.props.conversation
		const { conversationList,currentConversation } = store.getState()
		const currentCon = _.find(conversationList,(con)=>con.targetId==targetId)
		if(currentConversation){
			if(targetId==currentConversation.targetId && currentConversation.unreadCount==0){
				return
			}
		}
		$('textarea').val('')
		$('.pointed-message').hide()
    window.$mentionedFriends = []
		if(currentCon){
			if(currentCon.conversationType=='PRIVATE'){
				FriendIdentity(targetId)
			}
			if(currentCon.conversationType=='GROUP'){
				window.$friendidentity = 0
			}
      store.dispatch(clearConMessageList())
			getHistoryMessage(targetId,0).then(res=>{
        // console.log(res.list)
				if(res.list.length>0){
					syncMsgUnreadcount(res.list[res.list.length-1])
					_.forEach(res.list,item=>new MessageType(item,'toggle-conversation'))
				  const timer =	window.setTimeout(()=>{
						const { conMessageList } = store.getState()
						if(conMessageList.length>0){
							let Msglist = _.uniqBy(conMessageList,'sentTime').sort((msgA,msgB)=>{
								return parseInt(msgA.sentTime)-parseInt(msgB.sentTime)
							})
							new MessageType(Msglist[Msglist.length-1],'login')
						}
						clearTimeout(timer)
					},1000)
				}
				if(res.list.length==0){
					store.dispatch(updateConversationLatestMsg(targetId,''))
				}
        let timer = window.setTimeout(()=>{
          window.scrollMessageList.scrollToBottom()
          clearTimeout(timer)
        },500)
			})
		  DOMController.closeAllModalBox()
			if(currentCon.unreadCount>0){
				  clearUnreadCount(targetId)
					store.dispatch(updateConversationUnreadCount(targetId,0))
			}
		  store.dispatch(toggleCurrentConversation(currentCon))
			if(currentCon.conversationType=='GROUP'){
				  Group.getGroupInfo(targetId).then(res=>{
            store.dispatch(getGroupInfo(res))
          })
			}
			let conDivs = document.getElementsByClassName('conversation-')
			for(let div of conDivs){
				  div.classList.remove('current-con')
			}
			this.refs.current.classList.add('current-con')
			$('.logo-image').hide()
			DOMController.controlLeftNavIcon(0)
		}
	}

	sentTime(){
		  if(this.props.conversation.latestMsg){
				  return <span className={'sent-time'}>
					    {formatTime(this.props.conversation.sentTime)}
					  </span>
			}else{
				  return ''
			}
	}
	unreadCount(){
		  let unreadCount = this.props.conversation.unreadCount
			if(unreadCount>0){
				  let count = unreadCount>99 ? '99+' : unreadCount
				  return <span className={'unread-count' + (this.props.conversation.noTips=='1' ? ' no-tips' : '')}>{count}</span>
			}
	}
	noTipsNotice(){
		const { unreadCount,noTips } = this.props.conversation
		if(unreadCount>0 && noTips=='1'){
			return <span className={'no-tips-notice'}></span>
		}
	}
	latestMsg(){
		  if(this.props.conversation.latestMsg){
				return <span className={'latest-msg'}
					dangerouslySetInnerHTML={{__html: RongIMLib.RongIMEmoji.emojiToHTML(String(this.props.conversation.latestMsg))}}>
				</span>
			}
	}
	contextMenu(ev){
		ev.preventDefault()
		store.dispatch(contextmenuObj(this.props.conversation))
		store.dispatch(contextmenuEvent(ev.nativeEvent))
		DOMController.showModalBox([{
			selector:'.handle-menu',display:'block'
		}])
	}
  render(){
		return <div className={"conversation-" + (this.props.conversation.isTop=='1' ? ' is-top' : '')} onClick={this.toggleConversation.bind(this)} 
		    ref="current" data-id={this.props.conversation.targetId}
				onContextMenu={this.contextMenu.bind(this)}>
				<UserPortrait userInfo={this.props.conversation} size={'default'}
						showEl={[{selector:'#user-info',display:'block'}]} prevent={'1'}></UserPortrait>
				<span className={'nickname'}>{this.props.conversation.nickname}</span>
				{this.props.conversation.noTips=='1' ? <span className={'iconfont icon-miandarao'}></span> : ''}
				{this.sentTime.bind(this)()}
				<p>
				    <span className={'sender-name'}>{this.props.conversation.senderName ? (this.props.conversation.senderName + ': ') : ''}</span>
						{this.latestMsg.bind(this)()}
				</p>
				{this.unreadCount.bind(this)()}
				{this.noTipsNotice.bind(this)()}
		</div>
  }
}
