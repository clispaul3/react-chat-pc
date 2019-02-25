import axios from 'axios'
import async from 'async'
import store from '@/store/store'
import { getFriendList,getGroupList,getUserInfo,getNewFriendList } from '@/store/action'
import { SortMail } from '@/public/SortMail'
import _ from 'lodash'
import { callbacks } from '@/rongcloud/initParams'
import { appKey } from '@/utils/config'
import { initSDK } from '@/rongcloud/initSDK'
import { CountDown } from '@/public/countdown'
import userInfo_db from '@/localdb/userinfo'
import { $host } from '@/utils/config'
export class Ajax {
    static user_token
    static r_token
    // 用户登录
    static login(params,callback){
        const { mobile,login_type,password } = params
        axios.post(`${$host}` + '/session',{
            mobile,login_type,password
        }).then(res=>{
            if(res.data.status=='1'){
                Ajax.init(res.data.data,status=>{
                    callback(status)
                })
            }
        })
    }
    static init(userInfo,callback){
        userInfo_db.select_one({
            userUuid:userInfo.uuid,
            nickname:userInfo.nickname,
            avatar:userInfo.avatar
        },data=>{
            if(data=='insert'){
                window.$voiceNotice = true
                window.$newMsgNotice = true
            }else{
               const setting = data.rows[0]
               window.$voiceNotice = setting.voiceNotice=='1' ? true : false
               window.$newMsgNotice = setting.newMsgNotice=='1' ? true : false
            }
        })
        sessionStorage.setItem('user_token',userInfo.token)
        sessionStorage.setItem('r_token',userInfo.r_token)
        localStorage.setItem('latestuser',userInfo.uuid + '~~~' + userInfo.avatar + '~~~' + userInfo.nickname)
        Ajax.user_token = userInfo.token
        Ajax.r_token = userInfo.r_token
        window.$loginTime = new Date().getTime()
        async.parallel([Ajax.getFriendList,Ajax.getGroupList,Ajax.getNewFriendList],(err,result)=>{
            if(err){
            }else{
                store.dispatch(getFriendList(new SortMail({list:result[0].data}).getSortMail()))
                store.dispatch(getGroupList(new SortMail({list:result[1].data}).getSortMail()))
                store.dispatch(getUserInfo(userInfo))
                CountDown()
                store.dispatch(getNewFriendList(result[2].data))
                initSDK(RongIMLib,{appKey,token:userInfo.r_token},callbacks)
                callback('1')
            }
        })
    }
    // 获取好友列表
    static getFriendList(callback){
        axios.get(`${$host}` + '/v1/friends',{
            params:{
                token:Ajax.user_token,
            }
        }).then(res=>{
            if(res.data.status=='1'){
                callback(null,res.data)
            }
        })
    }
    // 获取群组列表
    static getGroupList(callback){
        axios.get(`${$host}` + '/v1/group/1',{
            params:{
                token:Ajax.user_token
            }
        }).then(res=>{
            if(res.data.status=='1'){
                callback(null,res.data)
            }
        })
    }
    // 获取新朋友列表
    static getNewFriendList(callback){
        axios.get(`${$host}` + '/v1/friends/request',{
            params:{
                token:Ajax.user_token
            }
        }).then(res=>{
            callback(null,res.data)
        })
    }
    // 查询好友信息
    static getFriendInfo(params,callback){
        let { friendList } = store.getState()
        if(friendList.length>0){
            let friend = _.find(friendList,(item)=> item.uuid==params.uuid)
            if(friend==undefined){
                axios.get(`${$host}` + '/v1/search_friends',{
                    params:{
                        token:Ajax.user_token,
                        to_user:params.uuid
                    }
                }).then(res=>{
                    if(res.data.status=='1'){
                        callback(res.data.data)
                    }
                })
            }else{
                callback(friend)
            }
        }
    }
    // 查找群组资料
    static getGroupInfo(params,callback){
        axios.get(`${$host}` + '/v1/group/query/' + params.id,{
            params:{
                token:Ajax.user_token
            }
        }).then(res=>{
            if(res.data.status=='1'){
                callback(res.data.data)
            }
        })
    }
    // 检测版本
    static checkVersion(callback){
        axios.get(`${$host}` + '/api/version',{
            params:{
                version_id:'1.0.0',
                type:'3'
            }
        }).then(res=>{
            callback(res.data)
        })
    }
    // 语音转文字
    static voiceToText(message,callback){
        axios.post(`${$host}` + '/v1/speechtrans',{
            file:message.content.content,
            message_id:message.messageUId,
            token:Ajax.user_token
        }).then(res=>{
            callback(res.data)
        })
    }
}
