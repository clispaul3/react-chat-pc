import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import style_modal from './modalbox.scss'
export class ModalBeforeFiveDaysMsg extends Component {
  constructor(props) {
    super(props)
  }
  render(){
    return <div className={'modal-before-five-days-msg'}>
        <p className={"p-title"}>
            <span className={'notice'}>提示</span>
            <span className={"iconfont icon-guanbi"} onClick={DOMController.closeAllModalBox.bind(this)}></span>
        </p>
        <p className={"notice"}>5天前的消息请在手机上查看！</p>
        <button className={'btn-success'} onClick={DOMController.closeAllModalBox.bind(this)}>
            确定
        </button>
      </div>
  }
}

