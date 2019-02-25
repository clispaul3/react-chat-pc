import { handleMsgStepOne } from '@/rongcloud/messageStepOne'
import store from '@/store/store'

export class RegisterMessage{
	constructor(){
		
	}
	/**
	 * WY:FriendHandle(同意好友请求)
	 * WY:FriendNotification(1-->添加，2-->拒绝，4-->删除)
	 **/
	static handleFriend(params, objectName){
		const messageName = "handleFriend"
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['backUpMsg','handleType','receiverUUID','senderAvatar','senderUUID','senderNickName']
		RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes)
		if(params=='init'){
			// console.log('添加好友消息注册成功')
			return
		}
		const conversationType = RongIMLib.ConversationType.PRIVATE
		const msg = new RongIMClient.RegisterMessage.handleFriend({
			backUpMsg:params.backUpMsg,
			handleType:params.handleType,
			receiverUUID:params.receiverUUID,
			senderAvatar:params.senderAvatar,
			senderUUID:params.senderUUID,
			senderNickName:params.senderNickName,
		})
		RongIMClient.getInstance().sendMessage(conversationType,params.receiverUUID, msg, {
			onSuccess: function (message) {
				handleMsgStepOne(message)
			},
			onError: function (errorCode) {
				console.log(objectName + '失败' + errorCode)
			}
		});
	}
	// 自定义提醒认证消息
	static remindAuthentication(params){
		const messageName = 'IdentityNotification'
		const objectName = 'WY:IdentityNotification' 
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['receiverUUID','senderUUID','tipsContent']
		RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes)
		if(params=='init'){
			// console.log('提醒认证消息注册成功')
			return
		}
		const conversationType = RongIMLib.ConversationType.PRIVATE
		const msg = new RongIMClient.RegisterMessage.IdentityNotification({
			receiverUUID:params.receiverUUID,
			senderUUID:params.senderUUID,
			tipsContent:params.tipsContent,
		})
		RongIMClient.getInstance().sendMessage(conversationType,params.receiverUUID, msg, {
			onSuccess: function (message) {
				handleMsgStepOne(message)
			},
			onError: function (errorCode) {
				// console.log('发送提醒认证消息失败',errorCode)
			}
		})
	}
	// 自定义分享名片消息
	static shareCard(params){
		const messageName = 'ShareCard'
		const objectName = 'RC:CardMsg'
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['name','sendUserId','sendUserName','userId','portraitUri']
		const conversationType = RongIMLib.ConversationType[params.conversationType]
		RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes)
		if(params=='init'){
			// console.log('分享名片消息注册成功')
			return
		}
		const msg = new RongIMClient.RegisterMessage.ShareCard({
			name:params.name,
			userId:params.userId,
			sendUserId:params.sendUserId,
			sendUserName:params.sendUserName,
			portraitUri:params.portraitUri
		})
		RongIMClient.getInstance().sendMessage(conversationType,params.targetId, msg, {
			onSuccess: function (message) {
				handleMsgStepOne(message)
			},
			onError: function (errorCode) {
				console.log('发送名片消息失败',errorCode)
			}
		})
	}
	// 自定义链接卡片消息
	static linkCardMessage(params){
		const messageName = 'LinkCard'
		const objectName = 'WY:ShareLinkContentMessage'
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['desc','img','title','url']
		RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes)
		if(params=='init'){
			// console.log('链接卡片消息注册成功')
			return
		}
		const { currentConversation } = store.getState()
		const conversationType = RongIMLib.ConversationType[currentConversation.conversationType]
		const msg = new RongIMClient.RegisterMessage.LinkCard({
			desc:params.desc,
			title:params.title,
			img:params.img,
			url:params.url,
		})
		RongIMClient.getInstance().sendMessage(conversationType,currentConversation.targetId, msg, {
			onSuccess: function (message) {
				handleMsgStepOne(message)
			},
			onError: function (errorCode) {
				// console.log('发送链接卡片消息失败',errorCode)
			}
		})
	}
	// 注册表情云消息
	static stickerMessage(params){
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['bqmmContent','bqmmExtra']
		RongIMClient.registerMessageType('StickerEmojiMessage','RCBQMM:EmojiMsg',mesasgeTag,prototypes)
		RongIMClient.registerMessageType('StickerGifMessage','RCBQMM:GifMsg',mesasgeTag,prototypes)
		if(params=='init'){
			// console.log('动态表情消息注册成功')
			return
		}
	}
	// 注册融云表情消息
	static rongGifMsg(params){
		const messageName = 'RongStickerMessage'
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['packageId','stickerId','digest','height','width']
		RongIMClient.registerMessageType(messageName,'RC:StkMsg',mesasgeTag,prototypes)
		if(params=='init'){
			// console.log('融云动态表情消息注册成功')
			return
		}
	}
	// 注册小视频消息
	static sightMessage(params){
		const messageName = 'SightMessage'
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['content','duration','localPath','name','sightUrl','size']
		RongIMClient.registerMessageType(messageName,'RC:SightMsg',mesasgeTag,prototypes)
		if(params=='init'){
			// console.log('小视频消息注册成功')
			return
		}
	}
}
export function initRegisterMsg(){
	RegisterMessage.handleFriend('init','WY:FriendHandle')
	RegisterMessage.handleFriend('init','WY:FriendNotification')
	RegisterMessage.shareCard('init')
	RegisterMessage.remindAuthentication('init')
	RegisterMessage.linkCardMessage('init')
	RegisterMessage.stickerMessage('init')
	RegisterMessage.rongGifMsg('init')
	RegisterMessage.sightMessage('init')
}