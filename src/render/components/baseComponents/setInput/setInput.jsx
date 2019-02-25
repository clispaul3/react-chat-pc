import React from 'react'
import { Input } from 'element-react'
import setInpputStyle from './setInput.scss'
import store from '@/store/store'
import {getGroupNotice,updateUserNickname,
	updateUserSignature } from '@/store/action'
import { $host } from '@/utils/config'
import { Group } from '@/class/Group'
/**
 * @props
 * operation:相关的操作
 * val:传入的值
 **/
export class SetInput extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			userUuid:store.getState().userInfo.uuid,
			value:'',
			className:'set-input'
		}
	}
	changeOperate(value){
		this.setState({value})
	}
	blurOperate(){
		const { operation } = this.props
		let id
		if(store.getState().groupInfo){
			id = store.getState().groupInfo.group_info.id
		}
		switch(operation){
			case 'remark-name':
				const { uuid } = store.getState().friendInfo
				console.log(this.state.value)
				if(uuid==this.state.userUuid){
					axios.put(`${$host}` + '/user/save',{
						token:Ajax.user_token,
						nickname:this.state.value
					}).then(res=>{
						if(res.data.status=='1'){
							store.dispatch(updateUserNickname(this.state.value))
						}
					})
				}else{
					axios.put(`${$host}` + '/v1/friends/1',{
						token:Ajax.user_token,
						to_user:store.getState().friendInfo.uuid,
						remark_name:this.state.value
					}).then(res=>{})
				}
				break
			case 'signature':
				axios.put(`${$host}` + '/user/1',{
					token:Ajax.user_token,
					signature:this.state.value
				}).then(res=>{
					if(res.data.status=='1'){
						store.dispatch(updateUserSignature(this.state.value))
					}
				})
				break
			case 'group-name':
				axios.put(`${$host}` + '/v1/group/' + id,{
					token:Ajax.user_token,
					name:this.state.value
				}).then(res=>{
					if(res.data.status==1){
						Group.getGroupInfo(id).then(ginfo=>{})
					}
				})
				break
			case 'group-notice':
			    if(this.state.value==undefined) break
				axios.post(`${$host}` + '/v1/group/notice',{
					token:Ajax.user_token,
					content:this.state.value,
					group_id:id
				}).then(res=>{
					store.dispatch(getGroupNotice(this.state.value))
				})
				break
			case 'group-nickname':
			    axios.put(`${$host}` + '/v1/group/upnickname',{
					token:Ajax.user_token,
					nickname:this.state.value,
					gid:id
				}).then(res=>{})
				break
			default:
				return
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({value:nextProps.val})
		if(nextProps.operation=='group-name'){
			this.setState({className:'set-input group-name'})
		}
		if(nextProps.operation=='group-notice'){
			this.setState({className:'set-input group-notice'})
		}
	}
	createTag(){
		let operation = this.props.operation || ''
		let mySelf = false
		switch(operation){
			case 'signature':
				if(store.getState().friendInfo){
					const { uuid } = store.getState().friendInfo
					mySelf = (this.state.userUuid == uuid) ? true : false
				}
				if(mySelf){
					return <Input value={this.state.value ? this.state.value : this.props.val} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
				}else{
					if(this.props.val){
						return <span title={this.state.value}>{this.state.value}</span>
					}else{
						return <span style={{color:'#8b8b8b'}}></span>
					}
				}
				break
			case 'remark-name':
				if(store.getState().friendInfo){
					if(this.state.value || this.state.value==''){
						return <Input value={this.state.value} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}else{
						return <Input placeholder={'暂无备注名'} value={this.props.val} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}
				}
				break
			case 'group-name':
				if(store.getState().groupInfo){
					const { owner } = store.getState().groupInfo.group_info
					mySelf = (this.state.userUuid == owner) ? true : false
				}
				if(mySelf){
					if(this.props.val){
						return <Input value={this.state.value} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}
				}else{
					if(this.props.val){
						return <span title={this.state.value}>{this.state.value}</span>
					}
				}
				break
			case 'group-notice':
				if(store.getState().groupInfo){
					const { owner } = store.getState().groupInfo.group_info
					mySelf = (this.state.userUuid == owner) ? true : false
				}
				if(mySelf){
					if(this.props.val){
						return <Input value={this.state.value} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}else{
						return <Input placeholder={'暂无群公告'} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}
				}else{
					if(this.props.val){
						return <span title={this.state.value}>{this.state.value}</span>
					}else{
						return <span>暂无群公告</span>
					}
				}
				break
			case 'group-nickname':
				if(store.getState().groupInfo){
					if(this.props.val){
						return <Input value={this.state.value} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}
				}
				break
			default:
			    break
		}
	}
	render(){
		return <div className={this.state.className}>
			{this.createTag.bind(this)()}
		</div>
	}
}