import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import style_modal from './modalbox.scss'
export class NoTransmitMessage extends Component {
  constructor(props) {
    super(props)
  }
  render(){
    return <div className={'modal-no-transmit-message'}>
        <p className={"p-title"}>
            <span className={'notice'}>提示</span>
            <span className={"iconfont icon-guanbi"} onClick={DOMController.closeAllModalBox.bind(this)}></span>
        </p>
        <p className={"notice"}>您选择的消息中，语音、名片、报告、支付消息、特殊消息不能转发给好友，请知悉！</p>
        <button className={'btn-success'} onClick={DOMController.closeAllModalBox.bind(this)}>
            确定
        </button>
      </div>
  }
}