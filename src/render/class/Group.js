import store from '@/store/store'
import { Ajax } from '@/public/ajax'
import axios from 'axios'
import { deleteGroup,updateGroupInfo,updateConversationNickname,updateConversationIcon} from '@/store/action'
import { $host } from '@/utils/config'
export class Group{
    constructor(){

    }
	// 获取群组信息
	static getGroupInfo(targetId){
		return new Promise((resolve,reject)=>{
			axios.get(`${$host}` + '/v1/group/query/' + targetId,{
				params:{token:Ajax.user_token}
			}).then(res=>{
				if(res.data.status=='1'){
					store.dispatch(updateGroupInfo(targetId,res.data.data.group_info))
					store.dispatch(updateConversationNickname(targetId,res.data.data.group_info.name))
					store.dispatch(updateConversationIcon(targetId,res.data.data.group_info.icon))
					resolve(res.data.data)
				}
			})
		})
	}
	// 获取群公告
	static getGroupNotice(targetId){
		return new Promise((resolve,reject)=>{
			axios.get(`${$host}` + '/v1/group/notice',{
				params:{token:Ajax.user_token,group_id:targetId}
			}).then(notice=>{
				if(notice.data.status=='1'){
					resolve(notice.data.data)
				}
			})
		})
	}
	// PC-->创建群组(会收到融云消息)
	static createGroup(params,callback){
		axios.post(`${$host}` + '/v1/group',{
			token:Ajax.user_token,
			name:params.name,
			friends:params.friends
		}).then(res=>{
			if(res.data.status=='1'){
				callback(res.data.data)
			}
		})
	}
	// PC-->解散群组(会收到融云消息)
	static deleteGroup(params,callback){
		axios.delete(`${$host}` + '/v1/group/' + params.id + '?token=' + Ajax.user_token)
			.then(res=>{
				if(res.data.status=='1'){
					callback(res.data)
					store.dispatch(deleteGroup(params.id))
				}
		})
	}
	// PC-->邀请好友加入群组(会收到融云消息)
	static joinGroup(params, callback){
		const { id, friends } = params
		axios.post(`${$host}` + '/v1/group/join',{
			id,
			token:Ajax.user_token,
			friends
		}).then(res=>{
			callback(res.data)
		})
	}
	// PC-->移除群成员(自己退出群组|移除其他成员)(会收到融云消息)
	static quitGroup(params, callback){
		const { id, friends } = params
		axios.put(`${$host}` + '/v1/group/quit',{
			token:Ajax.user_token,
			id ,
			friends,
		}).then(res=>{
			callback(res.data)
		})
	}
}
