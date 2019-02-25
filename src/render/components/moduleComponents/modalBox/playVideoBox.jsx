import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import style_modal from './modalbox.scss'

export class PlayVideoBox extends Component {
  constructor(props) {
    super(props)
  }
  destoryVideoObj(){
    DOMController.closeAllModalBox()
    if(window.$currentVideo){
        window.$currentVideo.overVideo()
        window.$currentVideo = null
    }
  }
  render(){
    return <div className={'box-play-video-msg'}>
        <p className={"p-title"}>
            <span className={'notice'}>小视频</span>
            <span className={"iconfont icon-guanbi"} onClick={this.destoryVideoObj.bind(this)}></span>
        </p>
        <div id={'container-video'}>
        </div>
      </div>
  }
}
