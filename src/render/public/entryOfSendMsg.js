import store from '@/store/store'
import _ from 'lodash'
import { toggleCurrentConversation,addOneConversation,clearConMessageList } from '@/store/action'
import { getHistoryMessage } from '@/rongcloud/getHistoryMessage'
import { MessageType } from '@/rongcloud/messageType'
import { Conversation } from '@/class/Conversation'
/**
 * targetId： 会话targetId
 * conversationType: 会话类型 'PRIVATE' | 'GROUP'
 */
export function entryOfSendMsg(targetId,conversationType){
	const { conversationList,currentConversation } = store.getState()
	const existCon = _.find(conversationList,item => item.targetId == targetId)
	const intoCon = (timestrap) => {
		let timer = window.setTimeout(()=>{
			let conDivs = document.getElementsByClassName('conversation-')
			for(let i=0;i<conDivs.length;i++){
				if(conDivs[i].dataset.id==targetId){
					conDivs[i].classList.add('current-con')
					window.scrollConList.scrollTop(i*70)
				}else{
					conDivs[i].classList.remove('current-con')
				}
			}
			if(currentConversation){
				if(currentConversation.targetId==targetId){
					return
				}
			}
			store.dispatch(clearConMessageList())
			getHistoryMessage(targetId,0).then(res=>{
				if(res.list.length>0){
					_.forEach(res.list,item=>new MessageType(item,'toggle-conversation'))
					let timer = window.setTimeout(()=>{
						window.scrollMessageList.scrollToBottom()
						clearTimeout(timer)
					},100)
				}
			})
			clearTimeout(timer)
		},timestrap)
	}
	if(existCon){
		store.dispatch(toggleCurrentConversation(existCon))
		intoCon(0)
	}else{
		Conversation.createConversation(targetId,conversationType,newCon=>{
			newCon.sentTime = new Date().getTime()
			store.dispatch(toggleCurrentConversation(newCon))
			store.dispatch(addOneConversation(newCon))
			intoCon(300)
		})
	}
	DOMController.controlLeftNavIcon(0)
	DOMController.closeAllModalBox()
	$('.scroll-mail-list').hide()
	$('.scroll-conversation-list').show()
	$('.logo-image').hide()
}
