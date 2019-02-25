import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import style_modal from './modalbox.scss'
export class ZoomAvatar extends Component {
  constructor(props) {
    super(props)
  }
  render(){
    return <div className={'zoom-avatar'}>
        <p className={"p-title"}>
            <span className={'notice'}>头像</span>
            <span className={"iconfont icon-guanbi"} onClick={DOMController.closeAllModalBox.bind(this)}></span>
        </p>
        <img src="" alt="" className={'avatar-container'}/>
      </div>
  }
}