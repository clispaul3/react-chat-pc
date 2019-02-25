import React, { Component } from 'react'
import style from './ZoomWin.scss'
const { ipcRenderer } = window.require('electron')
/**
 * @description: 
 * @props {String route} 
 * @return: 
 */
export class ZoomWin extends Component {
    constructor(props){
        super(props)
    }
    zoom(str){
        ipcRenderer.send('zoom-window',str)
    }
    render(){
        return <div className='zoom-window'>
            {this.props.route=='index' ? <span className='zoom-top iconfont icon-zhiding' onClick={this.zoom.bind(this,'top')}></span> : ''}
            <span className='zoom-in iconfont icon-zuixiaohua' onClick={this.zoom.bind(this,'in')}></span>
            {this.props.route=='index' ? <span className='zoom-out iconfont icon-zuidahua' onClick={this.zoom.bind(this,'out')}></span> : ''}
            <span className='zoom-close iconfont icon-guanbi' onClick={this.zoom.bind(this,'close')}></span>
        </div>
    }
}
