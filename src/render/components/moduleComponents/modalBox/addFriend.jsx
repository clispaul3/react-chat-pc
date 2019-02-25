import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import store from '@/store/store'
import { Input } from 'element-react'
import style_modal from './modalbox.scss'
import { Friend } from '@/class/Friend'
export class AddFriendReason extends Component {
  constructor(props) {
    super(props)
    this.state = {
        addreason:'',
        display:'block'
    }
  }
  componentDidMount(){
    this.setState({addreason:'你好，我是' + store.getState().userInfo.nickname})
  }
  addFriend(){
    const reason = this.refs.addReason.props.value
    const { friendInfo } = store.getState()
    Friend.addFriend(friendInfo.uuid,'0',reason)
    DOMController.closeAllModalBox()
  }
  changeAddReason(val){
    this.setState({addreason:val})
    if(val==''){
      this.setState({display:'none'})
    }else{
      this.setState({display:'block'})
    }
  }
  clear(){
    this.setState({addreason:'',display:'none'})
  }
  render(){
    return <div className={'add-friend-reason'}>
        <p className={"p-title"}>
            <span className={'notice'}>好友验证</span>
            <span className={"iconfont icon-guanbi"} onClick={DOMController.closeAllModalBox.bind(this)}></span>
        </p>
        <span className={'iconfont icon-guanbi1'} style={{display:this.state.display}}
          onClick={this.clear.bind(this)}></span>
        <Input value={this.state.addreason} ref={'addReason'} 
            onChange={this.changeAddReason.bind(this)}/>
        <button className={'btn-success'} onClick={this.addFriend.bind(this)}>
            确定
        </button>
      </div>
  }
}