import React from 'react'
import css_userInfo from './userInfo.scss'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import { ClearMessage } from '@base/clearMessage/clearMessage'
import { connect } from 'react-redux'
import { SetInput } from '@base/setInput/setInput'
import store from '@/store/store'
import { entryOfSendMsg } from '@/public/entryOfSendMsg'
import _ from 'lodash'
import { getUserERweima } from '@/utils/getErweima'
import { fileName } from '@/utils/fileName'
/**
 * props: friendInfo
 */
export class UserInfo extends React.Component{
    constructor(props){
		super(props)
		this.state = {
			sexClassName:'sex iconfont icon-icon-nv',
			friendInfo:null
		}
    }
    componentWillReceiveProps(nextprops){
		if(store.getState().friendInfo==undefined){
			this.setState({
				friendInfo:nextprops.userInfo
			})
		}
		if(store.getState().friendInfo){
			const { sex } = nextprops.userInfo
			this.setState({
				friendInfo:nextprops.userInfo
			})
			if(sex=='男'){
				this.setState({sexClassName:'sex iconfont icon-nan'})
			}else{
				this.setState({sexClassName:'sex iconfont icon-icon-nv'})
			}
		}
    }
    renderHTMLup(){
		if(this.state.friendInfo){
			return <div className="up">
				<div className="left">
					<p className={'nickname'}>
						<span>{this.state.friendInfo.nickname}</span>
						<i className={this.state.sexClassName}></i>
					</p>
					<p className={'mc-number'}>{'米仓号：'}{this.state.friendInfo.number}</p>
				</div>
				<UserPortrait userInfo={this.state.friendInfo}  prevent={'1'} showEl={[{selector:'#user-info',display:'block'}]}></UserPortrait>
			</div>
		}
	}
	renderHTMLremarkName(myself,isFriend){
		if(!isFriend && !myself){
			return ''
		}else{
			return <div className={'remark-name'}>
				<span>{myself ? '昵称' : '备注名'}</span>
				<SetInput val={myself ? this.props.userInfo.nickname : this.props.userInfo.remark_name} operation="remark-name"></SetInput>
			</div>
		}
	}
    renderHTMLdown(){
		if(this.state.friendInfo){
			const { friendList,userInfo } = store.getState()
			const myself = userInfo.uuid == this.props.userInfo.uuid
			const isFriend = _.find(friendList,item=>item.uuid==this.props.userInfo.uuid) ? true : false
			let clearMsgTag = (myself || !isFriend) ? '' : <p className={'clear-message'} onClick={this.clearMessage.bind(this)}>清除聊天记录</p>
			if(myself){
				clearMsgTag = <p className={'clear-message'} onClick={getUserERweima.bind(this)}>我的二维码</p>
			}
			return <div className={'down'}>
			    {this.renderHTMLremarkName.bind(this)(myself,isFriend)}
				<div className={'mobile-phone'}>
				    <span>手机号</span>
					<span>{fileName('mobile',this.props.userInfo.mobile)}</span>
				</div>
				<div className={'user-address'}>
				    <span>地区</span>
					<span>{this.props.userInfo.address}</span>
				</div>
				<div className={'signature'}>
					<span>个性签名</span>
					<SetInput val={this.props.userInfo.signature} operation="signature"></SetInput>
				</div>
				{clearMsgTag}
				{this.renderButtonSendMsg.bind(this)()}
				<ClearMessage range={'PRIVATE'} targetId={this.props.userInfo.uuid}></ClearMessage>
			</div>
		}
    }
	sendMessage(){
		const { uuid } = this.state.friendInfo
		entryOfSendMsg(uuid,'PRIVATE')
	}
	addFriend(){
		const { friendInfo,addNewFriendMsg } = store.getState()
		Friend.beforeAddFriend({mobile:friendInfo.mobile},res=>{
			const { addFriendQuery,addToMeQuery } = res[0]
			if(addFriendQuery==1){
				DOMController.showModalBox([{
					selector:'.waiting-friend-response',
					display:'block'
				}])
			}
			if(addToMeQuery==1){
				DOMController.showModalBox([{
					selector:'.box-handle-friend',
					display:'block'
				}])
			}
			if(addFriendQuery==0 && addToMeQuery==0){
				DOMController.showModalBox([{
					selector:'.add-friend-reason',display:'block'
				}])
			}
		})
	}
	clearMessage(){
		DOMController.showModalBox([{selector:'#user-info',display:'block'},{selector:'.modal-clear-message',display:'block'}])
	}
	renderButtonSendMsg(){
		const { uuid } = this.state.friendInfo
		const { userInfo,friendList } = store.getState()
		let operationSpan = ''
		const isFriend = _.find(friendList, item => item.uuid == uuid)
		if(uuid==userInfo.uuid){
			return ''
		}
		if(isFriend){
			operationSpan = <span className={'iconfont icon-xiaoxi'} onClick={this.sendMessage.bind(this)}></span>
		}else{
			operationSpan = <span className={'iconfont icon-tianjiahaoyou1'} onClick={this.addFriend.bind(this)}></span>
		}
		return <div className={'send-message'}>
			{operationSpan}
		</div>
	}
	closeErweima(){
		$('.user-erweima').hide()
		$('.user-erweima').removeClass('fadeIn')
	}
    renderErweima(){
		return <div className={'user-erweima animated'}>
			<div id={'user-erweima'}></div>
			<p>扫一扫上面的二维码图案，加我9号米仓</p>
			<img src={store.getState().userInfo.avatar} alt=""/>
			<span className={'iconfont icon-guanbi'} onClick={this.closeErweima.bind(this)}></span>
		</div>
	}
    render(){
    	return <div id="user-info">
			{this.renderHTMLup.bind(this)()}
			{this.renderHTMLdown.bind(this)()}
			{this.renderErweima()}
		</div>
    }
}
const mapStateUserInfo = (state)=>{return {userInfo:state.friendInfo}}
export default connect (mapStateUserInfo)(UserInfo)
