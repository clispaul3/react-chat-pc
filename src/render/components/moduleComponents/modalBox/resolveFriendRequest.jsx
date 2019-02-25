import React, { Component } from 'react'
import style_modal from './modalbox.scss'
import { closeModal } from './closemodal'
export class ResolveFriendRequest extends Component {
    constructor(props) {
      super(props)
    }
    render(){
        return <div className={'resolve-friend-request'}>
            <p className={"p-title"}>
                <span className={'notice'}>提示</span>
                <span className={"iconfont icon-guanbi"} onClick={closeModal.bind(this)}></span>
            </p>
            <span className={'iconfont icon-Group- icon-notice'}></span>
            <span className={'content'}>已添加</span>
        </div>
    }
}