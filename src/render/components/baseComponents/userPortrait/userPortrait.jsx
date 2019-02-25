import React from 'react'
import store from '@/store/store'
import { getFriendInfo,getGroupInfo } from '@/store/action'
/**
  props:
   userInfo(Object): 用户信息
   prevent(String): 是否展示用户信息 ‘1’ 不展示
   showEl(Array): 显示的弹框
   size(String): 头像的尺寸 'default' | undefined
*/
export class UserPortrait extends React.Component{
    constructor(props){
        super(props)
    }
    // 计算头像(群头像/好友头像)
    portraitClassName(){
        if(this.props.userInfo==undefined){
            return <span className={this.props.size=='default' ? 'nickname-portrait-primary' : 'nickname-portrait-mini'}
                style={{background:DOMController.portraitColor()}}>
                {'9'}
            </span>
        }
        let targetId = ''
        let portrait = ''
        let name = ''
        // 群头像
        if(this.props.userInfo.nickname==undefined){
            name = this.props.userInfo.name
            portrait = this.props.userInfo.icon
            targetId = this.props.userInfo.id
        }
        // 群成员头像
        if(this.props.userInfo.nickname!=undefined && this.props.userInfo.icon==undefined){
            name = this.props.userInfo.nickname
            targetId = this.props.userInfo.uuid
            portrait = this.props.userInfo.avatar
        }
        // 好友头像
        if(this.props.userInfo.mobile!=undefined){
            name = this.props.userInfo.remark_name || this.props.userInfo.nickname
            targetId = this.props.userInfo.uuid
            portrait = this.props.userInfo.avatar || null
        }
        // 会话头像
        if(this.props.userInfo.conversationType){
            name = this.props.userInfo.remark_name || this.props.userInfo.nickname
            targetId = this.props.userInfo.targetId
            portrait = this.props.userInfo.avatar
        }
        // 新朋友请求头像
        if(this.props.userInfo.ready_id){
            name = this.props.userInfo.nickname
            targetId = this.props.userInfo.myApply==1 ? this.props.userInfo.to_user : this.props.userInfo.go_user
            portrait = this.props.userInfo.avatar
        }
        if(portrait==null){
            return <span className={this.props.size=='default' ? 'nickname-portrait-primary' : 'nickname-portrait-mini'}
                onClick={(ev)=>this.showUserInfo(targetId,ev)}
                style={{background:DOMController.portraitColor(targetId)}}>
                {String(name)[0].toUpperCase()}
            </span>
        }
        if(portrait!==null){
            return <img src={portrait} alt=""
                onClick={(ev)=>this.showUserInfo(targetId,ev)}
                className={this.props.size=='default' ? 'avatar-portrait-primary' : 'avatar-portrait-mini'}/>
        }
    }
    // 显示用户信息 | 群组信息
    showUserInfo(uuid,ev){
        if(this.props.prevent=='1'){
            if(this.props.userInfo.conversationType) return
            ev.stopPropagation()
            const imgSrc = this.props.userInfo.avatar || this.props.userInfo.icon
            DOMController.showModalBox([{selector:'.zoom-avatar',display:'block'}])
            document.querySelector('.avatar-container').src = imgSrc
            return
        }
        ev.stopPropagation()
        let event = ev.nativeEvent
        if(this.props.userInfo.nickname){
    			Friend.getFriendInfo(uuid).then(info=>{
    				DOMController.showModalBox(this.props.showEl,event)
                store.dispatch(getFriendInfo(info))
    			})
        }
        if(this.props.userInfo.icon!=undefined){
          Ajax.getGroupInfo({id:uuid},res=>{
              DOMController.showModalBox(this.props.showEl,event)
              store.dispatch(getGroupInfo(res))
          })
        }
    }
    render(){
        return <div className={this.props.size=='default' ? 'user-portrait nickname-portrait-primary' : 'user-portrait nickname-portrait-mini'}>
            {this.portraitClassName()}
        </div>
    }
}
