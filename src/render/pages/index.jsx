import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import globalCssStyle from '@/assets/iconfont/iconfont.css'
import videoStyle from '@/assets/jqueryVideo/font/iconfont.css'
import globalStyle from '@/style/common'
import indexStyle from './index.scss'
import UserInfo from '@module/userInfo/userInfo'
import { FriendList } from '@module/friendList/friendList'
import store from '@/store/store.js'
import GroupInfo from '@module/groupInfo/groupInfo'
import GroupInfo2 from '@module/talkArea/group'
import 'element-theme-default'
import { Scrollbars } from 'react-custom-scrollbars'
import { SearchInput } from '@base/searchInput/searchInput'
import { ModalBeforeFiveDaysMsg } from '@module/modalBox/beforeFiveDaysMsg'
import { PlayVideoBox } from '@module/modalBox/playVideoBox'
import { ResolveFriendRequest } from '@module/modalBox/resolveFriendRequest'
import { RejectFriendRequest } from '@module/modalBox/rejectFriendRequest'
import { WaitingFriendResponse } from '@module/modalBox/waitingFriendRes'
import { AddFriendReason } from '@module/modalBox/addFriend'
import { SendMessagFail } from '@module/modalBox/sendMsgFail'
import { SelectMoreOneMsg } from '@module/modalBox/selectMoreOneMsg'
import { ZoomAvatar } from '@module/modalBox/zoomAvatar'
import { NoTransmitMessage } from '@module/modalBox/noTransmitMsg'
import HandleFriend from '@module/modalBox/handleFriend'
import LeftNav from '@module/leftNav/leftNav.jsx'
import { connect } from 'react-redux'
import TalkArea from '@module/talkArea/talkArea'
import ConversationList from '@module/conversationList/conversationList'
import HandleMenu from '@base/handleMenu/handleMenu'
import  ChooseContainer from '@module/chooseContainer/chooseContainer'
import { AddFriendGroup } from '@module/addFriendGroup/addFriendGroup'
import { ZoomWin } from '@base/zoomWin/zoomWin'
import { styleScroll } from './style'

const { platform } = window.require('os')
const logoImgUrl = require('@static/logo-image.png')
const { ipcRenderer } = window.require('electron')
export class Index extends React.Component{
    constructor(props){
		super(props)
		this.state = {
			addFriendGroup:0
		}
    }
	// 全局搜索结果列表
	renderGlobalSearchList(){
		const searchResList = store.getState().createGroup
		if(searchResList.length==0){
			return
		}
		if(searchResList.length>0 && searchResList[0].range){
			const styleObj = {
				width:242,
				height:'100%',
				left:70,
				top:52,
				position:'absolute',
				zIndex:5000,
				background:'#fff'
			}
			return <Scrollbars style={styleObj}  autoHide autoHideDuration={200}
					onScroll={DOMController.showModalBox.bind(this,[{selector:'.scroll-search-list',display:'block'}])} 
					className={'scroll-search-list scroll-container'}>
					<div id="search-list">
						<FriendList friendList={searchResList} showEl={[{selector:'#user-info',display:'block'}]}
						    firstLetter={'1'}>
						</FriendList>
					</div>
				</Scrollbars>
		}
		
	}
	showModalBox(idx){
		DOMController.closeAllModalBox()
		DOMController.controlLeftNavIcon(idx)
	}
	componentDidMount(){
		window.scrollConList = this.refs.scrollConList
		ipcRenderer.send('route','index')
	}
	addFriend(){
		this.setState({addFriendGroup:1},()=>{
			DOMController.showModalBox([{
				selector:'.modal-add-friend-group',
				display:'block'
			}])
		})
	}
    render(){
        return <div className={'page-index'}>
			<LeftNav></LeftNav>
			<SearchInput left={'70px'} closeAll={'1'} range={'发起会话'}></SearchInput>
			<UserInfo></UserInfo>
			<div className="logo-image">
				<div className={'logo-image-left'}></div>
				<div className={'logo-image-right'}>
					<img src={logoImgUrl} alt=""/>
				</div>
			</div>
			<GroupInfo></GroupInfo>
			<Scrollbars style={styleScroll}  
				autoHide autoHideDuration={200} ref={'scrollConList'}
				onScroll={this.showModalBox.bind(this,0)} className={'scroll-conversation-list scroll-container'}>
				<ConversationList></ConversationList>
				<div className={'conversation- last-blank'} style={{border:'0 none',height:'60px',cursor:'default'}}>
				</div>
			</Scrollbars>
			<Scrollbars style={styleScroll}  autoHide autoHideDuration={200}
				onScroll={this.showModalBox.bind(this,1)} className={'scroll-mail-list scroll-container'}>
				<div className={'add-friend-group'} onClick={this.addFriend.bind(this)}>
					<span className={'iconfont icon-jiahaoyoutubiao'}></span>
					{/* <span>加好友/群</span> */}
					<span>添加好友</span>
				</div>
				<div id="mail-list">
					<FriendList friendList={this.props.newFriendList} title="new-friend" showEl={[{selector:'#user-info',display:'block'}]} firstLetter={'1'}></FriendList>
					<FriendList friendList={this.props.friendList} title="friend" showEl={[{selector:'#user-info',display:'block'}]}></FriendList>
					<FriendList friendList={this.props.groupList} title="group" firstLetter={'1'} showEl={[{selector:'.group-info-right',display:'block'}]}></FriendList>
				</div>
				<div className={'conversation- last-blank'} style={{border:'0 none',height:'60px'}}></div>
			</Scrollbars>
			{this.renderGlobalSearchList.bind(this)()}
			<TalkArea></TalkArea>
			<ModalBeforeFiveDaysMsg></ModalBeforeFiveDaysMsg>
			<PlayVideoBox></PlayVideoBox>
			<GroupInfo2></GroupInfo2>
			<HandleFriend></HandleFriend>
			<ResolveFriendRequest></ResolveFriendRequest>
			<RejectFriendRequest></RejectFriendRequest>
			<WaitingFriendResponse></WaitingFriendResponse>
			<AddFriendReason></AddFriendReason>
			<SendMessagFail></SendMessagFail>
			<ZoomAvatar></ZoomAvatar>
			<NoTransmitMessage></NoTransmitMessage>
			<HandleMenu></HandleMenu>
			<SelectMoreOneMsg></SelectMoreOneMsg>
			{this.state.addFriendGroup!=0 ? <AddFriendGroup></AddFriendGroup> : ''}
			<ChooseContainer containerTitle={'转发消息'} 
				searchRange={_.concat(store.getState().friendList,store.getState().groupList)}
				containerClass={'container-transmit-message'}>
			</ChooseContainer>
			{platform()!=='darwin' ? <ZoomWin route='index'></ZoomWin> : ''}
		</div>
    }
}
const mapState = (state)=>{
	return {
		friendList:state.friendList,
		groupList:state.groupList,
		searchContent:state.searchContent,
		newFriendList:state.newFriendList
	}
}
export default connect (mapState)(Index)