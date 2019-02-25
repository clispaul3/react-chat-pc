import store from '@/store/store'
import _ from 'lodash'
import { clearUnreadCount } from './clearUnreadCount'
import { mentionedMsg } from './mentionedMsg'
import { updateConversationLatestMsg,updateConversationSentTime,updateConversationSenderName,
    updateConversationUnreadCount,pushOneMsgToMsgList,shiftOneMsgToMsgList,deleteOneMessage,
    deleteFriend,deleteOneConversation,toggleCurrentConversation,
    updateConversationLastReadtime,updateMsgReadstatus} from '@/store/action'
import { getStickerMsgUrl } from './stickerMessage'
import { getEmojiStickerUrl } from '@/rongcloud/emojiStickerMsg'
import { clearConHistoryMsg } from '@/rongcloud/clearHistoryMsg'
import deletemsg_db from '@/localdb/deletemsg'
import conversation_db from '@/localdb/conversation'
import voicemsg_db from '@/localdb/voicemsg'
/**
 * 处理顺序：消息时间-->消息类型-->会话类型
 * params:
 *   message(Object):融云消息
 *   origin:消息来源
 * 处理逻辑: 会话最近一条消息的内容 | 消息发送时间 | 消息发送者 | 会话未读数量
 * 5天前的消息：会话中仍然保留sendTime senderName latestMsg这些字段，只是不显示出来
 */
export class MessageType{
    constructor(message,origin){
      this.message = message
      this.groupMessageType = 'GroupNotificationMessage'
      this.commonType = [
          {type:'TextMessage',content:message.messageType=='TextMessage' ? message.content.content : ''},
          {type:'VoiceMessage',content:'[语音]'},
          {type:'ImageMessage',content:'[图片]'},
          {type:'FileMessage',content:'[文件]'},
          {type:'LocationMessage',content:'[地理位置]'},
          {type:'RecallCommandMessage',content:'[撤回消息]'}
      ]
      this.specialObjName = [
		  {type:'WY:IdentityNotification',content:'[提醒认证]'},
          {type:'RCBQMM:GifMsg',content:'[动态表情]'},
          {type:'RCBQMM:EmojiMsg',content:'[动态表情]'},
          {type:'RC:StkMsg',content:'[动态表情]'},
          {type:'WY:ShareReportMessage',content:'[分享报告]'},
          {type:'WY:UploadpicNotification',content:'[上传照片]'},
          {type:'RC:RcCmd',content:'[撤回消息]'},
          {type:'RC:CardMsg',content:'[个人名片]'},
          {type:'WY:FriendHandle',content:'[添加好友]'},
          {type:'RC:SightMsg',content:'[小视频]'},
          {type:'WY:CallNotificationMessage',content:'[呼唤]'},
          {type:'WY:RedPacketMessage',content:'[红包]'},
          {type:'WY:ShareLinkContentMessage',content:'[分享]'}
      ]
      this.groupMsgName = [
          {type:'Create',content:'[创建群组]'},
          {type:'Add',content:'[添加成员]'},
          {type:'Quit',content:'[退出群组]'},
          {type:'Kicked',content:'[删除成员]'},
          {type:'Dismiss',content:'[解散群组]'},
          {type:'Rename',content:'[修改群名称]'}
      ]
      this.origin = origin
  		if(this.checkMsgType()){
  			const { targetId } = this.message
  			const currentConversation = store.getState().currentConversation
  			let current = false
  			if(currentConversation){
  				current = targetId==currentConversation.targetId ? true : false
  			}
        if(this.messageSentTime()==false){
          return
        }
  			switch(origin){
  				case 'login':
  				    this.updateConLatestMsg()
  					this.updateConSenderName()
  					break
  				case 'toggle-conversation':
  					if(current){
  						this.updateConMsgList('push')
  					}
  					break
          case 'loading-more-msg':
            if(current){
              this.updateConMsgList('shift')
            }
            break
  				case 'pc-receive':
  				    this.updateConLatestMsg()
  				    this.updateConSenderName()
  					if(current){
  						this.updateConMsgList('push')
  					}else{
  						this.updateConUnreadCount()
  					}
  					break
  				default:
  				  console.log('未监测到任何参数，请检查传入参数')
  			}
  		}
    }
  	messageSentTime(){
  	  const { sentTime,targetId } = this.message
      const updateSentTimeOperation = ['login','pc-receive','pc-send']
      if(updateSentTimeOperation.indexOf(this.origin)>=0){
        store.dispatch(updateConversationSentTime(targetId,sentTime))
      }
      if(window.$syncMsg=='2' && window.$loginTime>sentTime){
        return false
      }
      if((window.$loginTime-sentTime)>1000*60*60*24*5){
        return false
      }else{
        return true
      }
  	}
    checkMsgType(){
      let checkType = null
      if(this.message.messageType!=this.groupMessageType){
          let { messageType } = this.message
          let { objectName } = this.message
          let msgType = _.find(this.commonType,(item)=>item.type==messageType)
          let objType =  _.find(this.specialObjName,(item)=>item.type==objectName)
          checkType = msgType || objType
      }
      if(this.message.messageType==this.groupMessageType){
          checkType = _.find(this.groupMsgName,(O)=>O.type==this.message.content.operation)
      }
      if(checkType==null){
        const { objectName,messageDirection } = this.message
        if(objectName=='WY:FriendNotification'){
            if(this.message.content.handleType==4){
                this.deleteFriendMsg()
                return
            }
        }
        if(objectName=='RC:TypSts' || objectName=='RC:ReadNtf'){
            if(messageDirection==2){
                const { userInfo } = store.getState()
                conversation_db.set_last_readtime({
                    conId:userInfo.uuid + '~~~' + this.message.targetId,
                    lastReadtime:this.message.sentTime
                },res=>{
                    if(res.rowsAffected>=1){
                        const { currentConversation } = store.getState()
                        if(currentConversation){
                            if(currentConversation.targetId==this.message.targetId){
                                store.dispatch(updateConversationLastReadtime(this.message.sentTime))
                                store.dispatch(updateMsgReadstatus(this.message.sentTime))
                            }
                        }
                    }
                })
                console.log('已读/送达状态更新')
            }
            if(messageDirection==1){
                this.updateConUnreadCount()
            }
        }
        if(objectName=='RC:SRSMsg' && messageDirection==1){
            this.updateConUnreadCount()
        }
        console.log('未检测到的消息类型',this.message.objectName)
      }
      return checkType
    }
    updateConLatestMsg(){
        const { targetId,conversationType,objectName } = this.message
  		let content = this.checkMsgType() ? this.checkMsgType().content : ''
  		if(conversationType==3){
  			if(this.message.content.mentionedInfo){
  				mentionedMsg(this.message,res=>{
                    store.dispatch(updateConversationLatestMsg(targetId,RongIMLib.RongIMEmoji.emojiToSymbol(res)))
  				})
  			}else{
                if(objectName=='RCBQMM:EmojiMsg' || objectName=='RCBQMM:GifMsg'){
                    content = this.message.content.bqmmContent
                }
                if(objectName=='RC:StkMsg'){
                    content = '[' + this.message.content.digest + ']'
                }
                store.dispatch(updateConversationLatestMsg(targetId,RongIMLib.RongIMEmoji.emojiToSymbol(content)))
  			}
  		}
  		if(conversationType==1){
            store.dispatch(updateConversationLatestMsg(targetId,RongIMLib.RongIMEmoji.emojiToSymbol(content)))
        }
  	}
    updateConSenderName(){
  		const { conversationType } = this.message
  		const { targetId} = this.message
  		if(conversationType==3){
  			const { senderUserId } = this.message
  			const { uuid } = store.getState().userInfo
  			if(senderUserId!==uuid){
  				Friend.getFriendInfo(senderUserId).then(info=>{
  					let nickname = info.remark_name || info.nickname
                    store.dispatch(updateConversationSenderName(targetId,nickname))
  				})
  			}else{
                store.dispatch(updateConversationSenderName(targetId,''))
  			}
  		}
  	}
  	updateConUnreadCount(){
  		const { targetId,messageDirection } = this.message
  		const conversation = _.find(store.getState().conversationList,(con)=>con.targetId==targetId)
  		if(messageDirection==1){
  			store.dispatch(updateConversationUnreadCount(targetId,0))
  			clearUnreadCount(targetId)
  		}else{
  			let count = conversation.unreadCount + 1
  			store.dispatch(updateConversationUnreadCount(targetId,count))
  		}
  	}
    updateConMsgList(str){
        let msgType = this.checkMsgType()
        if(msgType==null){
            console.log('未检测到的消息类型',this.message.objectName)
        }
        if(msgType){
            if(msgType.type=='Rename'){
                const {targetGroupName} = this.message.content.data
                const id = this.message.targetId
            }
            let spcecialMsgType = ['RC:StkMsg','RCBQMM:EmojiMsg','RC:CardMsg','WY:ShareReportMessage',
              'RCBQMM:GifMsg','WY:CallNotificationMessage','WY:RedPacketMessage']
            let { objectName } = this.message
            if(spcecialMsgType.indexOf(objectName)>=0){
                let str = this.message.messageDirection==1 ? '发出' : '收到'
                str += msgType.content
                str = str.replace(/\[/gi, '')
                str = str.replace(/\]$/gi, '')
                str += '，请在手机上查看'
                this.message.content.content = str
                if(this.message.objectName=='WY:CallNotificationMessage'){
                    let { callOperationType } = this.message.content.message.content
                    let friendName = store.getState().currentConversation.nickname
                    if(callOperationType=='3' || callOperationType==3){
                        if(this.message.messageDirection==1){
                            this.message.content.content = '你拒绝了' + friendName + '的呼唤邀请'
                        }else{
                            this.message.content.content = friendName + '拒绝了你的呼唤邀请'
                        }
                    }
                    if(callOperationType=='2' || callOperationType==2){
                        if(this.message.messageDirection==1){
                            this.message.content.content = '你接受了' + friendName + '的呼唤邀请'
                        }else{
                            this.message.content.content = friendName + '接受了你的呼唤邀请'
                        }
                    }
                }
            }
            const asyncMsgType = ['RC:StkMsg','RCBQMM:EmojiMsg','RC:RcCmd','RC:VcMsg']
            if(asyncMsgType.indexOf(objectName)>=0 || this.message.content.mentionedInfo){
                this.asyncMessage(str)
            }else{
                this.addConversationMsg(str)
            }
        }
    }
    // 添加当前会话消息
    addConversationMsg(str){
        const { conMessageList,userInfo } = store.getState()
        const msg = _.find(conMessageList,(item)=>item.messageUId==this.message.messageUId)

        if(msg && msg.messageUId){
            return
        }
        deletemsg_db.select_one_msg({
            msgId:userInfo.uuid + '~~~' + this.message.messageUId,
        },res=>{
            if(res.rows.length>=1){
                // console.log('该消息已被删除')
            }else{
                if(str=='push'){
                    store.dispatch(pushOneMsgToMsgList(this.message))
                    if(this.message.messageDirection==1){
                        window.scrollMessageList.scrollToBottom()
                    }
                }
                if(str=='shift'){
                    store.dispatch(shiftOneMsgToMsgList(this.message))
                }
            }
        })
    }
    // 删除好友消息
    deleteFriendMsg(){
        const { targetId } = this.message
        const { conversationList, currentConversation } = store.getState()
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
        clearConHistoryMsg(targetId)
		store.dispatch(deleteFriend(targetId))
		showLogo()
		Friend.getNewFriendLsit(1).then(res=>{})
    }
    // 异步消息处理
    asyncMessage(str){
        const { objectName,conversationType,senderUserId,messageDirection } = this.message
        const { userInfo } = store.getState()
        if(objectName=='RC:StkMsg'){
            const { packageId,stickerId } = this.message.content
            getStickerMsgUrl({ packageId,stickerId },sticker=>{
                this.message.gifuri = sticker.url
                this.addConversationMsg(str)
            })
        }
        if(objectName=='RCBQMM:EmojiMsg'){
            const { content } = this.message
            const gifcode = JSON.parse(content.bqmmExtra).msg_data[0][0]
            getEmojiStickerUrl(gifcode,res=>{
                const gifuri = res.data_list[0].main_image
                this.message.gifuri = gifuri
                this.addConversationMsg(str)
            })
        }
        if(conversationType==3){
            if(this.message.content.mentionedInfo){
                mentionedMsg(this.message,res=>{
                    this.message.content.content = res
                    this.addConversationMsg(str)
                })
            }
        }
        if(objectName=='RC:RcCmd'){
            const { messageUId } = this.message.content
            if(messageDirection==1){
                store.dispatch(deleteOneMessage(messageUId))
                this.message.content.content = '你撤回了一条消息'
                this.addConversationMsg(str)
            }else{
                if(conversationType==1){
                    const { currentConversation } = store.getState()
                    store.dispatch(deleteOneMessage(messageUId))
                    this.message.content.content = ( currentConversation.remark_name || currentConversation.nickname ) + ' 撤回了一条消息'
                    this.addConversationMsg(str)
                }
                if(conversationType==3){
                    Friend.getFriendInfo(senderUserId).then(info=>{
                        store.dispatch(deleteOneMessage(messageUId))
                        this.message.content.content = ( info.remark_name || info.nickname ) + ' 撤回了一条消息'
                        this.addConversationMsg(str)
                    })
                }
            }
        }
        if(objectName=='RC:VcMsg'){
            let params = {
                msgId:userInfo.uuid + '~~~' + this.message.messageUId,
                targetId:this.message.targetId,
                senderUserId,
                textContent:'',
                isListened:'0'
            }
            voicemsg_db.select_one({msgId:params.msgId},res=>{
                if(res.rows.length>=1){
                    const result = res.rows[0]
                    this.message.isListened = result.isListened
                    this.message.textContent = result.textContent
                    this.addConversationMsg(str)
                }else{
                    voicemsg_db.insert_one(params,res=>{
                        if(res.rowsAffected>=1){
                            console.log('insert voicemsg success')
                        }
                    })
                    this.message.isListened = '0'
                    this.message.textContent = ''
                    this.addConversationMsg(str)
                }
            })
            
        }
    }
}
