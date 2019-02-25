import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import { ZoomWin } from '@base/zoomWin/zoomWin'
import loginLeftImg from '@/assets/login-left.png'
import downErweima from '@/assets/download-erweima.png'
import style_modal from './login.scss'
import LoginErweima from '@module/login/loginErweima'
import { LoginoutFromApp } from '@module/modalBox/loginoutFromApp'
const { ipcRenderer,shell } = window.require('electron')
const { platform } = window.require('os')
export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginTwoClients: '0'
    }
  }
  componentDidMount(){
    ipcRenderer.send('route','login')
    if(window.$loginTwoClients=='1'){
      this.setState({loginTwoClients:'1'})
    }
  }
  toggleDownErweima(status){
    this.refs.downloaderweima.style.display = status
  }
  shellBrowser(str){
    if(str=='android'){
        shell.openExternal('https://a.app.qq.com/o/simple.jsp?pkgname=com.wnkj.jhmc.app')
    }
    if(str=='ios'){
        shell.openExternal('https://www.pgyer.com/442de1bb44d6e6e70b8fe25f6390f32c')
    }
  }
  loginOutTime(){
    if(this.state.loginTwoClients!='1'){
      return
    }
    let time = new Date()
    let hours = time.getHours()<10 ? ('0' + time.getHours) : time.getHours()
    let minutes = time.getMinutes()<10 ? ('0' + time.getMinutes()) : time.getMinutes()
    $('.login-two-clients').show()
    let timer = window.setTimeout(()=>{
        $('.login-two-clients').hide()
        clearTimeout(timer)
        this.setState({loginTwoClients:'0'},()=>{
          window.$loginTwoClients = '0'
        })
    },10000)
    return <p className={'login-two-clients'}>
        当前账号于 {hours + ':' + minutes} 在其他电脑上上登录，此客户端已退出登录
    </p>
  }
  render(){
    return <div className={'page-login'}>
        <div className={'login-left'}>
            <img src={loginLeftImg} alt=""/>
        </div>
        <div className={'login-right'}>
          <LoginErweima></LoginErweima>
          {this.loginOutTime.bind(this)()}
          <div className={'download-erweima'} ref={'downloaderweima'}>
            <img src={downErweima} alt=""/>
          </div>
          <ul>
            <li onMouseEnter={this.toggleDownErweima.bind(this,'block')} 
              onMouseLeave={this.toggleDownErweima.bind(this,'none')}>
              <span className={'iconfont icon-erweima'}></span>
              <span>二维码下载</span>
            </li>
            <li onClick={this.shellBrowser.bind(this,'android')}>
              <span className={'iconfont icon-changyonglogo37'}></span>
              <span>安卓下载</span>
            </li>
            <li onClick={this.shellBrowser.bind(this,'ios')}>
              <span className={'iconfont icon-ios'}></span>
              <span>苹果下载</span>
            </li>
          </ul>
          <LoginoutFromApp></LoginoutFromApp>
          {platform()!=='darwin' ? <ZoomWin route='login'></ZoomWin> : ''}
        </div>
      </div>
  }
}