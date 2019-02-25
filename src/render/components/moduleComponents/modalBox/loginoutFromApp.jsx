import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import style_modal from './modalbox.scss'
const { platform } = window.require('electron')
export class LoginoutFromApp extends Component {
  constructor(props) {
    super(props)
  }
  close(){
      this.refs.container.style.display = 'none'
  }
  render(){
    return <div className={'login-out-from-app'} ref={'container'}>
        <p className={"p-title"}>
            <span className={'notice'}>提示</span>
            <span className={"iconfont icon-guanbi"} onClick={this.close.bind(this)}></span>
        </p>
        <p className={"notice"}>{'您已退出9号米仓' + (platform=='win32' ? 'Window版' : 'Mac版')}</p>
        <button className={'btn-success'} onClick={this.close.bind(this)}>
            确定
        </button>
      </div>
  }
}