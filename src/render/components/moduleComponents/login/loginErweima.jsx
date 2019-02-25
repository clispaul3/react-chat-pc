import React, { Component } from 'react'
import { DOMController } from '@/class/DOMController'
import style_modal from './loginErweima.scss'
import { getLoginERweima } from '@/utils/getErweima'
import logo from '@/assets/logo-login.png'
import imgNotice from '@/assets/img-notice.png'
import { socket,closeSocket } from './socket'
import { withRouter } from "react-router-dom"   
import { Ajax } from '@/public/ajax'  
import store from '@/store/store'    
import { toggleCurrentConversation } from '@/store/action'     
/**
 * @state
 *  ewmstatus(String):0:正常 1:扫码成功 2:二维码失效
 **/
class LoginErweima extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ewmstatus:0,
      latestuser:{},
      loginAgainStatus:0
    }
  }
  fnSocket(){
    socket(res=>{
        // console.log(res)
        if(res.code==200){
            if(this.state.latestuser.uuid){
                this.setState({loginAgainStatus:1})
                return
            }
            getLoginERweima(res.fd,status=>{
                if(status=='1'){
                    this.setState({ewmstatus:2},()=>{
                        this.mouseEvent('leave')
                    })
                }
            })
        } 
        if(res.status=='1'){
            if(res.data.loginStatus=='1'){
                this.setState({ewmstatus:1},()=>{
                    this.mouseEvent('leave')
                })
            }
            if(res.data.loginStatus=='3'){
                const userinfo = res.data
                window.$syncMsg = res.data.sync // 1:同步 2:不同步
                localStorage.setItem('latestuser',userinfo.uuid + '~~~' + userinfo.avatar + '~~~' + userinfo.nickname)
                Ajax.init(userinfo,status=>{
                    if(status=='1'){
                        this.props.history.push('/home')
                        store.dispatch(toggleCurrentConversation(null))
                    }
                })
            }
            if(res.data.loginStatus=='4'){
                if(res.data.coerce==2 || res.data.coerce=='2'){
                    window.$loginTwoClients = '1'
                }else{
                    window.$loginTwoClients = '0'
                }
                window.$websocket.close()
                // window.$loginout = true
                this.props.history.push('/')
                if(res.data.coerce==1 || res.data.coerce=='1'){
                    const timer = setTimeout(()=>{
                        $('.login-out-from-app').show()
                        clearTimeout(timer)
                    },100)
                }
                if(res.data.coerce==3 || res.data.coerce=='3'){
                    const timer = window.setTimeout(()=>{
                        this.fnSocket()
                        this.setState({ewmstatus:0})
                        clearTimeout(timer)
                    },300)
                }
            }
        }
    })
  }
  componentDidMount(){
    const user = localStorage.getItem('latestuser')
    if(user){
       const userinfo = user.split('~~~')
       let [uuid,avatar,nickname] = userinfo
       this.setState({latestuser:{uuid,avatar,nickname}})
    }else{
        this.fnSocket()
    }
  }
  mouseEvent(type){
    if(this.state.ewmstatus!=0){
        $('#login-erweima').css({left:'175px'})
        $('.logo-icon').css({left:'253px'})
        $('.img-notice').css({right:'10px'}).hide().removeClass('fadeOutRight').hide()
        return
    }
    if(type=='enter'){
        $('#login-erweima').css({left:'105px'})
        $('.logo-icon').css({left:'183px'})
        $('.img-notice').css({right:'30px'}).addClass('fadeInRight').show()
    }
    if(type=='leave'){
        $('#login-erweima').css({left:'175px'})
        $('.logo-icon').css({left:'253px'})
        $('.img-notice').css({right:'10px'}).hide().removeClass('fadeOutRight').hide()
    }
  }
  createNewEWM(){
    this.setState({ewmstatus:0},()=>{
        this.fnSocket()
    })
  }
  toggleUser(){
    localStorage.setItem('latestuser','')
    this.setState({latestuser:{}},()=>{
        this.fnSocket()
    })
  }
  loginAgain(){
    
    this.fnSocket()
    closeSocket(status=>{
        if(status=='2'){
            localStorage.setItem('latestuser','')
            this.setState({latestuser:{}},()=>{
                const timer = window.setTimeout(()=>{
                    this.fnSocket()
                    clearTimeout(timer)
                },300)
            })
        }
    })
  }
  renderEWMstatus(){
    if(this.state.latestuser.uuid){
        return ''
    }
    if(this.state.ewmstatus!=0){
      const statustag = this.state.ewmstatus==1 ? <span>扫码成功</span> : <span className={'iconfont icon-shuaxin1'} onClick={this.createNewEWM.bind(this)}></span>  
      return <div className={'erweima-status'}>
        {statustag}
      </div> 
    }
  }
  renderTextNotice(){
      if(this.state.latestuser.uuid){
        return ''
      }
      if(this.state.ewmstatus==0){
        return <p className={'text-notice'}>
            请使用<span>9号米仓App</span>扫码登录
        </p>
      }
      if(this.state.ewmstatus==1){
        return  <p className={'text-notice'}>
          请使用<span>9号米仓App</span>确认登录
        </p>
      }
      if(this.state.ewmstatus==2){
        return  <p className={'text-notice'}>
          <span>二维码失效，请点击刷新二维码</span>
        </p>
      }
  }
  renderLatestUser(){
    if(this.state.latestuser.uuid){
        const { avatar,nickname } = this.state.latestuser
        return <div className={'latest-user'}>
            <img src={avatar} alt=""/>
            <span className={'nickname'}>{nickname}</span>
            {this.state.loginAgainStatus==0 ? <button className={'btn-success'} onClick={this.loginAgain.bind(this)}>登录</button> : <p className={'text-notice'}>请使用<span>9号米仓App</span>确认登录</p>}
            <p>
                <span className={'toggle-user'} onClick={this.toggleUser.bind(this)}>切换账号</span>
                <span className={'iconfont icon-jiantouyou'}></span>
            </p>
        </div>
    }
  }
  renderEWMarea(){
    if(this.state.latestuser.uuid){
        return ''
    }
    return <div className={'mouse-enter-area'} onMouseEnter={this.mouseEvent.bind(this,'enter')}
        onMouseLeave={this.mouseEvent.bind(this,'leave')}>
        <div id={'login-erweima'}></div>
        <img src={logo} alt="" className={'logo-icon'}/>
        <div className={'img-notice animated'}>
            <img src={imgNotice} alt=""/>
        </div>
      </div>
  }
  render(){
    return <div className={'login-erweima-area'}>
        {this.renderEWMarea.bind(this)()}
        {this.renderEWMstatus.bind(this)()}
        {this.renderTextNotice.bind(this)()}
        {this.renderLatestUser.bind(this)()}
      </div>
  }
}
export default withRouter(LoginErweima)