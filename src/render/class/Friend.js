import axios from 'axios'
import store from '@/store/store'
import _ from 'lodash'
import { updateConversationNickname,updateFriendInfo,
	updateConversationIcon,getNewFriendList } from '@/store/action'
import { RegisterMessage } from '@/rongcloud/registerMessage'
import { $host } from '@/utils/config'
export class Friend {
	constructor(){
		
	}
	static getFriendInfo(uuid){
		return new Promise((resolve,reject)=>{
			axios.get(`${$host}` + '/v1/search_friends',{
				params:{
					token:Ajax.user_token,
					to_user:uuid
				}
			}).then(res=>{
				if(res.data.status=='1'){
					const conNickname = res.data.data.remark_name || res.data.data.nickname
					const isFriend = _.find(store.getState().friendList,item=>item.uuid==uuid)
					if(isFriend){
						store.dispatch(updateFriendInfo(uuid,res.data.data))
						store.dispatch(updateConversationNickname(uuid,conNickname))
						store.dispatch(updateConversationIcon(uuid,res.data.data.avatar))
					}
					resolve(res.data.data)
				}else{
					console.log('获取好友资料失败')
				}
			})
		})
	}
	static getNewFriendLsit(page){
		return new Promise((resolve,reject)=>{
			axios.get(`${$host}` + '/v1/friends/request',{
				params:{
					token:Ajax.user_token,
					page,
					pageSize:'10'
				}
			}).then(res=>{
				if(res.data.status=='1'){
					if(res.data.data.length>0){
						store.dispatch(getNewFriendList(res.data.data))
					}
					resolve(res.data.data)
				}
			})
		})
	}
	// state(string): 2-->拒绝 | 3-->删除
	static deleteFriendRequest(ready_id,state){
		return new Promise((resolve,reject)=>{
			axios.put(`${$host}` + '/v1/friends/refuse',{
				token:Ajax.user_token,
				ready_id,
				state
			}).then(res=>{
				if(res.data.status=='1'){
					resolve(res.data.data)
				}
			})
		})
	}
	static resolveFriendRequest(go_user){
		return new Promise((resolve,reject)=>{
			axios.post(`${$host}` + 'v1/friends',{
				to_user:store.getState().userInfo.uuid,
				go_user
			}).then(res=>{
				resolve(res.data)
			})
		})
	}
	static deleteFriend(uuid){
		return new Promise((resolve,reject)=>{
			axios.delete(`${$host}` + '//v1/friends/1',{
				params:{
					token:Ajax.user_token,
					to_user:uuid
				}
			}).then(res=>{
				if(res.data.status=='1'){
					resolve('delete-success')
				}
			})
		})
	}
	static closeFriendIdtentity(uuid){
		axios.post(`${$host}` + '/v1/friends/closehint',{
			token:Ajax.user_token,
			to_user:uuid
		}).then(res=>{
			console.log(res.data)
		})
	}
	static addFriend(uuid,is_mobile='0',reason){
		axios.post(`${$host}` + '/v1/friends/ready',{
			token:Ajax.user_token,
			to_user:uuid,
			is_mobile,
			reason
		}).then(res=>{
			if(res.data.status=='1'){
				const { userInfo } = store.getState()
				RegisterMessage.handleFriend({
					backUpMsg:reason,
					handleType:1,
					senderUUID:userInfo.uuid,
					receiverUUID:uuid,
					senderAvatar:userInfo.avatar,
					senderNickname:userInfo.nickname
				},'WY:FriendNotification')
			}
		})
	}
	static beforeAddFriend(params,callback){
		axios.get(`${$host}` + '/user',{
			params:Object.assign({
				token:Ajax.user_token,
			},params)
		}).then(res=>{
			if(res.data.status=='1'){
				callback(res.data.data)
			}
		})
	}
}