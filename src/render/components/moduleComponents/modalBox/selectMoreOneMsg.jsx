import React, { Component } from 'react'
import style_modal from './modalbox.scss'
export class SelectMoreOneMsg extends Component {
    constructor(props) {
      super(props)
    }
    render(){
        return <div className={'select-more-one-message'}>
            <p className={"p-title"}>
                <span className={'notice'}>提示</span>
                <span className={"iconfont icon-guanbi"} onClick={DOMController.closeAllModalBox.bind(this)}></span>
            </p>
            <span className={'content'}>至少选择一条消息</span>
        </div>
    }
}