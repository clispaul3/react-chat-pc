import React from 'react'
import { clearAllHistoryMsg,clearConHistoryMsg } from '@/rongcloud/clearHistoryMsg'
import styleClearMsg from './clearMessage.scss'
/**
 * @props
 * range
 * targetId
 **/
export class ClearMessage extends React.Component{
    constructor(props){
       super(props)
    }
    closeModalBox(){
		const { range } = this.props
		switch(range){
			case 'ALL':
				DOMController.showModalBox([{selector:'.modal-system-setting',display:'block'}])
				break
		    case 'PRIVATE':
			    DOMController.showModalBox([{selector:'.user-info',display:'block'}])
				break
			case 'GROUP':
			    DOMController.showModalBox([{selector:'.group-info-',display:'block'}])
				break
			default:
			    return
		}
    }
    clearMsg(){
		this.closeModalBox()
		if(this.props.range=='ALL'){
			clearAllHistoryMsg()
		}else{
			clearConHistoryMsg(this.props.targetId)
		}
    }
    render(){
        return <div className={"modal-clear-message"}>
			<p className={"p-title"}>
				<span className={'notice'}>提示</span>
				<span className={"iconfont icon-guanbi"} onClick={this.closeModalBox.bind(this)}></span>
			</p>
			<p className={"notice"}>{this.props.range=='ALL' ? '确定清除所有聊天记录吗?' : '确定清除此会话聊天记录吗？'}</p>
			<button className={'btn-success'} onClick={this.clearMsg.bind(this)}>确定</button>
			<button className={'btn-default'} onClick={this.closeModalBox.bind(this)}>取消</button>
		</div>
    }
}
