import React from 'react'
import style_leftnav from './leftNav.scss'
import _ from 'lodash'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import  ChooseContainer from '@module/chooseContainer/chooseContainer'
import { connect } from 'react-redux'
import $ from 'jquery'
import { AppSetting } from './appSetting'
import { SystemSetting } from './systemSetting'
import { AboutApp } from './aboutApp'
import { CheckVersion } from './checkVersion'
import LoginOut from './loginOut'
import store from '@/store/store'
import { pageIdx } from '@/utils/config'
const { ipcRenderer } = window.require('electron')
export class LeftNav extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           searchContent:'',
           choosedFriend:[],
           version:'',
		   showChooseContainer:false
       }
    }
    componentWillReceiveProps(nextprops){
        ipcRenderer.send('unread-total-count',parseInt(nextprops.totalUnreadCount))
    }
    componentDidMount(){
        DOMController.closeAllModalBox()
        $('.scroll-mail-list').hide()
        $('.scroll-conversation-list').show()
        this.refs.icon1.classList.add('active')
    }
    // 切换列表
    toggleList(ev){
        let event = ev.nativeEvent
        this.refs.icon1.classList.remove('active')
        this.refs.icon2.classList.remove('active')
        this.refs.icon3.classList.remove('active')
        this.refs.icon4.classList.remove('active')
		$('.logo-image').show()
        event.target.className += ' active'
        if(ev.target.classList.contains('icon-jiaqun-changtai')){
			this.setState({showChooseContainer:true},()=>{
				DOMController.showModalBox([{selector:'#choose-container',display:'block'}])
			})
        }
        if(ev.target.classList.contains('icon-xinxi-changtai1')){
            DOMController.closeAllModalBox()
            $('.scroll-mail-list').hide()
            $('.scroll-conversation-list').show()
			const { currentConversation } = store.getState()
			if(currentConversation){
				$('.logo-image').hide()
			}
        }
        if(ev.target.classList.contains('icon-tongxunlu-changtai')){
            DOMController.closeAllModalBox()
            $('.scroll-mail-list').show()
            $('.scroll-conversation-list').hide()
        }
        if(ev.target.classList.contains('icon-gengduo')){
            DOMController.showModalBox([{selector:'.modal-app-setting',display:'block'}])
        }
    }
    // 打开第三方链接
    openURL(str){
        AppSetting.openURL(str)
    }
    // 打开弹框
    openModalBox(str){
        if(str=='close-all'){
            DOMController.closeAllModalBox()
        }
        if(str=='system-setting'){
            DOMController.showModalBox([{selector:'.modal-system-setting',display:'block'}])
        }
        if(str=='clear-all-message'){
            DOMController.showModalBox([{selector:'.modal-system-setting',display:'block'},{selector:'.modal-clear-message',display:'block'}])
        }
        if(str=='about-app'){
            DOMController.showModalBox([{selector:'.modal-about-app',display:'block'}])
        }
        if(str=='login-out'){
            DOMController.showModalBox([{selector:'.modal-login-out',display:'block'}])
        }
    }
    // 检测版本
    checkVersion(version){
        this.setState({
            version
        })
    }
	unreadCount(){
		if(this.props.totalUnreadCount){
			let count = this.props.totalUnreadCount>99 ? '99+' : this.props.totalUnreadCount
			return <div className={'total-unread-count'}>{count}</div>
		}else{
			return ''
		}
	}
	// 控制发起群聊弹框是否渲染
	renderChooseContainer(){
		if(this.state.showChooseContainer==true){
			return <ChooseContainer containerTitle={'发起群聊'} searchRange={store.getState().friendList} containerClass={'container-create-group'}></ChooseContainer>
		}else{
			return ''
		}
	}
    render(){
        return <div id="left-nav">
            <UserPortrait size={'default'} userInfo={this.props.userInfo} showEl={[{selector:'#user-info',display:'block'}]}></UserPortrait>
            <div className={'conversation'} style={{marginTop:'27px'}}>
                <span className={'iconfont icon-xinxi-changtai1 icon-left-nav'} onClick={this.toggleList.bind(this)} ref={'icon1'}></span>
            </div>
            <div className={'mail-list'} style={{marginTop:'49px'}}>
                <span className={'iconfont icon-tongxunlu-changtai icon-left-nav'} onClick={this.toggleList.bind(this)} ref={'icon2'}></span>
            </div>
            {this.unreadCount.bind(this)()}
            {this.props.unreadFriendRequest!=0 ? <div className={'unread-friend-request'}>{this.props.unreadFriendRequest}</div> : ''}
            <div className="create-group" style={{marginTop:'49px'}}>
                <span className={'iconfont icon-jiaqun-changtai icon-left-nav'} onClick={this.toggleList.bind(this)} ref={'icon3'}></span>
            </div>
            <div className={'app-setting'}>
                <span className={'iconfont icon-gengduo icon-left-nav'} onClick={this.toggleList.bind(this)} ref={'icon4'}></span>
                <ul className={'modal-app-setting'}>
                    <li>
                        <span className={'iconfont icon-kefu'}></span>
                        <span onClick={this.openURL.bind(this,'在线客服')}>在线客服</span>
                    </li>
                    <li onClick={this.openModalBox.bind(this,'about-app')}>
                        <span className={'iconfont icon-guanyusvg'}></span>
                        <span>关于</span>
                    </li>
                    <li onClick={this.openModalBox.bind(this,'system-setting')}>
                        <span className={'iconfont icon-shezhi'}></span>
                        <span>设置</span>
                    </li>
                    <li onClick={this.openModalBox.bind(this,'login-out')}>
                        <span className={'iconfont icon-kaiguan'}></span>
                        <span>退出</span>
                    </li>
                </ul>
            </div>
            <SystemSetting cancel={this.openModalBox.bind(this)}></SystemSetting>
            <AboutApp  checkVersion={this.checkVersion.bind(this)}></AboutApp>
            <CheckVersion version={this.state.version}></CheckVersion>
            {pageIdx==1 ? <LoginOut></LoginOut> : ''}
			{this.renderChooseContainer.bind(this)()}
        </div>
    }
}
const mapStateUserInfo = (state)=>{
    return {
        userInfo:state.userInfo,
        totalUnreadCount:state.totalUnreadCount,
        unreadFriendRequest:state.unreadFriendRequest
    }
}
export default connect (mapStateUserInfo)(LeftNav)