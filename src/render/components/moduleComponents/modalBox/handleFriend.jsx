import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import style_modal from './modalbox.scss'
import store from '@/store/store'
import { connect } from 'react-redux'
import { fileName } from '@/utils/fileName'
import { Friend } from '@/class/Friend'
import { RegisterMessage } from '@/rongcloud/registerMessage'
/**
 * @props
 * addreason(string):添加理由
 **/
export class HandleFriend extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  operateRequest(str){
    const { addNewFriendMsg,userInfo } = store.getState()
    let params = {
        backUpMsg:'',
        receiverUUID:addNewFriendMsg.from_user,
        senderAvatar:userInfo.avatar,
        senderUUID:userInfo.uuid,
        senderNickName:userInfo.nickname,
    }
    if(str=='reject'){
        Friend.deleteFriendRequest(addNewFriendMsg.ready_id,'3').then(res=>{
            RegisterMessage.handleFriend(Object.assign(params,{handleType:4}),'WY:FriendNotification')
            DOMController.showModalBox([{selector:'.reject-friend-request',display:'block'}])
        })
    }
    if(str=='resolve'){
        Friend.resolveFriendRequest(addNewFriendMsg.from_user).then(res=>{
            DOMController.showModalBox([{selector:'.resolve-friend-request',display:'block'}])
            RegisterMessage.handleFriend(Object.assign(params,{handleType:3}),'WY:FriendHandle')
            Friend.getNewFriendLsit(1).then(res=>{})
        })
    }
  }
  render(){
    if(this.props.addNewFriendMsg==null){
        return <div className={'box-handle-friend'}></div>
    }
    let { reason,nickname } = this.props.addNewFriendMsg
    if(reason=='' || reason==null){
        reason = '我是，' + nickname
    }
    return <div className={'box-handle-friend'}>
        <p className={"p-title"}>
            <span className={'notice'}>添加好友</span>
            <span className={"iconfont icon-guanbi"} onClick={DOMController.closeAllModalBox.bind(this)}></span>
        </p>
        <p className={'add-reason'}>
            {this.props.addNewFriendMsg ? fileName('add-reason',reason) : ''}
        </p>
        <span className={'refuse'} onClick={this.operateRequest.bind(this,'reject')}>删除</span>
        <span className={'resolve'} onClick={this.operateRequest.bind(this,'resolve')} style={{background:"#7595F1"}}>接受</span>
      </div>
  }
}
const mapState = (state)=>{return {addNewFriendMsg:state.addNewFriendMsg}}
export default connect (mapState)(HandleFriend)
