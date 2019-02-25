import React from 'react'
import style_talkArea from './talkArea.scss'
import { Group } from '@/class/Group'
import store from '@/store/store'
/**
 * props:
      operation(String):delete | quit
	  id(number):群组id
	  friends(String):移除成员的uuid
 */
export class QuitOrDeleteGroup extends React.Component{
	constructor(props){
		super(props)
	}
	showModals(){
		DOMController.showModalBox([{selector:'.group-info-',display:'block'}])
	}

	operate(){
		if(this.props.operation=='delete'){
			Group.deleteGroup({id:this.props.id},res=>{
				if(res.status=='1'){
					DOMController.closeAllModalBox()
				}
				console.log(res)
			})
		}
		if(this.props.operation=='quit'){
			Group.quitGroup({id:this.props.id,friends:store.getState().userInfo.uuid},res=>{
				if(res.status=='1'){
					DOMController.closeAllModalBox()
				}
				console.log(res)
			})
		}
	}
	render(){
		const { operation } = this.props
		const text = operation=='quit' ? '您确定退出当前群组吗?' : '您确定解散当前群组吗?'
		return <div className={"modal-quit-delete-group"}>
			<p className={"p-title"}>
				<span className={'notice'}>提示</span>
				<span className={"iconfont icon-guanbi"} onClick={this.showModals}></span>
			</p>
			<p className={"notice"}>{text}</p>
			<button className={'btn-success'} onClick={this.operate.bind(this)}>
				确定
			</button>
			<button className={'btn-default'} onClick={this.showModals.bind(this)}>
				取消
			</button>
		</div>
	}
	
}