import React from 'react'
const logonUrl = require('@static/logo.png')
import { AppSetting } from './appSetting'
export class AboutApp extends React.Component{
    constructor(props){
       super(props)
       this.state = {
           version:'已经是最新版本了'
       }
    }
    cancel(str){
        if(str=='about-app'){
            DOMController.closeAllModalBox()
        }
        if(str=='check-version'){
            Ajax.checkVersion(res=>{
                if(res.status=='0'){
                    this.setState({
                        version:'已经是最新版本了'
                    },()=>{
                        this.props.checkVersion(this.state.version)
                    })
                }else{
                    this.setState({
                        version:'检测到最新版' + res.data.newversion
                    },()=>{
                        this.props.checkVersion(this.state.version)
                    })
                }
            })
            DOMController.showModalBox([{selector:'.modal-check-version',display:'block'},{selector:'.modal-about-app',display:'block'}])
        }
    }
    openURL(str){
        AppSetting.openURL(str)
    }
    render(){
        return <div className="modal-about-app">
            <p className="p-title">
                <span className={'notice'}>关于</span>
                <span className="close iconfont icon-guanbi" onClick={this.cancel.bind(this,'about-app')}>
                </span>
            </p>
            <img src={logonUrl} alt=""/>
            <h3>9号米仓</h3>
            <p>
                <span onClick={this.openURL.bind(this,'官方网站')}>官方网站</span>
                <span onClick={this.openURL.bind(this,'服务协议')}>服务协议</span>
                <span onClick={this.cancel.bind(this,'check-version')}>检查更新</span>
            </p>
        </div>
    }
}
