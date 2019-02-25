import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import style_modal from './addFriendGroup.scss'
import { Input } from 'element-react'
import { Friend } from '@/class/Friend'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import { getFriendInfo } from '@/store/action'
import store from '@/store/store'
export class AddFriendGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
        placeholder:'手机号/9号米仓号',
        searchContent:'',
        searchResult:[],
        display:'none'
    }
  }
  toggleStatus(str){
    this.setState({searchContent:'',searchResult:[],display:'none'})
    if(str=='friend'){
        this.refs.group.classList.remove('current')
        this.refs.friend.classList.add('current')
        this.setState({placeholder:'手机号/9号米仓号'})
    }
    if(str=='group'){
        this.refs.friend.classList.remove('current')
        this.refs.group.classList.add('current')
        this.setState({placeholder:'群号/群名称'})
    }
  }
  search(){
    let val = this.state.searchContent
    if(this.state.placeholder=='手机号/9号米仓号'){
        Friend.beforeAddFriend({mobile:val},res=>{
            if(res.length>0){
                this.setState({searchResult:res})
            }else{
                this.setState({searchResult:[]})
                this.refs.noresult.style.display = 'block'
                let timer = window.setTimeout(()=>{
                    this.refs.noresult.style.display = 'none'
                    clearTimeout(timer)
                },3000)
            }
        })
    }
    if(this.state.placeholder=='群号/群名称'){
        console.log('group')
    }
  }
  change(val){
    this.setState({searchContent:val})
    if(val!=''){
        this.setState({display:'block'})
    }else{
        this.setState({display:'none'})
    }
  }
  operate(str,friend){
    let showEl = [{selector:'.modal-add-friend-group',display:'block'}]
    if(str=='已添加'){
        showEl.unshift({selector:'.resolve-friend-request',display:'block'})
    }
    if(str=='等待验证'){
        showEl.unshift({selector:'.waiting-friend-response',display:'block'})
    }
    if(str=='添加'){
        store.dispatch(getFriendInfo(friend))
        // showEl.unshift({selector:'#user-info',display:'block'})
        showEl = [{selector:'.add-friend-reason',display:'block'}]
    }
    DOMController.showModalBox(showEl)
  }
  clear(){
    this.setState({
      searchContent:'',
      display:'none'
    })
  }
  renderSearchRes(){
    if(this.state.searchResult.length>0){
      let friend = this.state.searchResult[0]
      const { addFriendQuery,addToMeQuery,is_my_friends } = friend
      const showEl = [{
        selector:'#user-info',display:'block'
      },{
        selector:'.modal-add-friend-group',display:'block'
      }]
      let operate = '添加'

      if(is_my_friends=='1'){
        operate = '已添加'
      }
      if(addFriendQuery==1){
        operate = '等待验证'
      }
      if(addToMeQuery==1){
        operate = '接受'
      }
      if(addFriendQuery==0 && addToMeQuery==0 && is_my_friends=='0'){
        operate = '添加'
      }
      return <div className={'search-result'}>
        <UserPortrait userInfo={friend} size={'default'} showEl={showEl}></UserPortrait>
        <p className={'nickname'}>{friend.remark_name || friend.nickname}</p>
        <span className={'operation'} onClick={this.operate.bind(this,operate,friend)}>{operate}</span>
      </div> 
    }
  }
  render(){
    return <div className={'modal-add-friend-group'}>
        <p className={"p-title"}>
            {/* <span className={'notice'}>添加好友/群</span> */}
            <span className={'notice'}>添加好友</span>
            <span className={"iconfont icon-guanbi"} onClick={DOMController.closeAllModalBox.bind(this)}></span>
        </p>
        {/* <p className={'toggle-btn'}>
            <span className={'add-friend current'} onClick={this.toggleStatus.bind(this,'friend')} ref={'friend'}>添加好友</span>
            <span className={'add-group'} onClick={this.toggleStatus.bind(this,'group')} ref={'group'}>添加群</span>
        </p> */}
        <span className={'iconfont icon-shousuo'}></span>
        <span className={'iconfont icon-guanbi1'} style={{display:this.state.display}} onClick={this.clear.bind(this)}></span>
        <button className={'btn-success'} onClick={this.search.bind(this)}>搜索</button>
        <Input placeholder={this.state.placeholder} value={this.state.searchContent} onChange={this.change.bind(this)}></Input>
        <p className={'no-result'} ref={'noresult'}>暂无搜索结果</p>
        {this.renderSearchRes.bind(this)()}
      </div>
  }
}