import React, { Component } from 'react'
import style_modal from './modalbox.scss'
export class SendMessagFail extends Component {
    constructor(props) {
      super(props)
    }
    render(){
        return <div className={'send-message-fail'}>
            <p className={"p-title"}>
                <span className={'notice'}>提示</span>
                <span className={"iconfont icon-guanbi"} onClick={DOMController.closeAllModalBox.bind(this)}></span>
            </p>
            <p className={"notice"}>已经暂停聊天服务，完成实人认证恢复聊天功能</p>
            <button className={'btn-success'} onClick={DOMController.closeAllModalBox.bind(this)}>
                确定
            </button>
        </div>
    }
}