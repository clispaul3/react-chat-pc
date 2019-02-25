import React from 'react'
const { platform } = window.require('electron')
import { withRouter } from 'react-router-dom'
class LoginOut extends React.Component{
    constructor(props){
       super(props)
    }
    closeModalBox(str){
        if(str=='login-out'){
            window.$websocket.close()
            this.props.history.push('/')
        }
        DOMController.closeAllModalBox()
    }
    render(){
        return <div className={"modal-login-out"}>
            <p className={"p-title"}>
                <span className={'notice'}>提示</span>
                <span className="iconfont icon-guanbi" onClick={this.closeModalBox.bind(this)}></span>
            </p>
            <p className={"notice"}>{'您确定要退出9号米仓' + (platform=='win32' ? 'Window版吗?' : 'Mac版吗?')}</p>
            <button className={'btn-success'} onClick={this.closeModalBox.bind(this,'login-out')}>
                确定
            </button>
        </div>
    }
}
export default withRouter(LoginOut)
