import React, { Component } from 'react'
import style_modal from './modalbox.scss'
import { closeModal } from './closemodal'
export class WaitingFriendResponse extends Component {
    constructor(props) {
      super(props)
    }
    componentDidMount(){
        let reg = 0
        const timer = window.setInterval(()=>{
            if(this.refs.iconwaiting==undefined){
                clearInterval(timer)
                return
            }
            this.refs.iconwaiting.style.transform = `translateX(-50%) rotate(${reg}deg)`
            reg += 10
        },100)
    }
    render(){
        return <div className={'waiting-friend-response'}>
            <p className={"p-title"}>
                <span className={'notice'}>提示</span>
                <span className={"iconfont icon-guanbi"} onClick={closeModal.bind(this)}></span>
            </p>
            <span className={'iconfont icon-dengdai icon-notice'} ref={'iconwaiting'}></span>
            <span className={'content'}>等待验证</span>
        </div>
    }
}