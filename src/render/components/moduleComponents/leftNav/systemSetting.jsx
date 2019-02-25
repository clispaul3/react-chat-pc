import { Switch } from 'element-react'
import React from 'react'
import { ClearMessage } from '@base/ClearMessage/clearMessage'
import userInfo_db from '@/localdb/userinfo'
import store from '@/store/store'
export class SystemSetting extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            voiceNotice:true,
            newMsgNotice:true
        }
    }
    componentDidMount(){
        this.setState({
            voiceNotice:window.$voiceNotice==false ? false : true,
            newMsgNotice:window.$newMsgNotice==false ? false : true
        })
    }
    appSetting(str,val){
        const { userInfo } = store.getState()
        let params = {
            userUuid:userInfo.uuid,
            avatar:userInfo.avatar,
            nickname:userInfo.nickname,
            autoStart:'1'
        }
        if(str=='tips'){
            this.setState({
                newMsgNotice:val
            },()=>{
                window.$newMsgNotice = val
                userInfo_db.update_one(Object.assign(params,{
                    newMsgNotice:val ? '1' : '0',
                    voiceNotice:this.state.newMsgNotice ? '1' : '0'
                }),res=>{})
            })
        }
        if(str=='voice'){
            this.setState({
                voiceNotice:val
            },()=>{
                window.$voiceNotice = val
                userInfo_db.update_one(Object.assign(params,{
                    voiceNotice:val ? '1' : '0',
                    newMsgNotice:this.state.newMsgNotice ? '1' : '0'
                }),res=>{})
            })
        }
    }
    render(){
        return <div className={"modal-system-setting"}>
            <p className={"p-title"}>
                <span className={'notice'}>系统设置</span>
                <span className={"iconfont icon-guanbi"} onClick={this.props.cancel.bind(this,'close-all')}></span>
            </p>
            <p className={"message-notice"}>
                <span>接收新消息通知</span>
            </p>
            <Switch value={this.state.newMsgNotice} 
              onColor="#4CD964" offColor="#BFBFBF" onChange={this.appSetting.bind(this,'tips')}></Switch>
            <p className={"message-voice"}>
                <span>消息提示声</span>
            </p>
            <Switch value={this.state.voiceNotice} 
              onColor="#4CD964" offColor="#BFBFBF" onChange={this.appSetting.bind(this,'voice')}></Switch>
            <p className={"clear-message"}>
                <span style={{color:'#7595F1'}} onClick={this.props.cancel.bind(this,'clear-all-message')}>清除聊天记录</span>
            </p>
            <ClearMessage range='ALL'></ClearMessage>
        </div>
    }
}