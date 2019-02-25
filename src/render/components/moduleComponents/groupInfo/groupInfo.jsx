import React from 'react'
import css_groupInfo from './groupInfo.scss'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Conversation } from '@/class/Conversation'
import { toggleCurrentConversation,addOneConversation } from '@/store/action'
import _ from 'lodash'
import store from '@/store/store'
import { entryOfSendMsg } from '@/public/entryOfSendMsg'

export class GroupInfo extends React.Component{
    constructor(props){
       super(props)
    }
    sendMessage(){
		const { id } = this.props.groupInfo.group_info
		entryOfSendMsg(id,'GROUP')
    }
    showBox(){
        DOMController.showModalBox([{selector:'.group-info-right',display:'block'}])
    }
    render(){
        if(this.props.groupInfo==undefined){
            return ''
        }
        return <div id="group-info">
            <div className={'group-info-left'}></div>
            <div className={'group-info-right'}>
                <p className={'title'}>{this.props.groupInfo.group_info.name + ' ( ' + this.props.groupInfo.members.length + ' )'} </p>
                <Scrollbars style={{ width:'100%', height:'80%' }}  autoHide autoHideDuration={200}
                        onScroll={this.showBox.bind(this)}>
                    <ul  className={'clearfix'}>
                        {this.props.groupInfo.members.map(item=>{
                            return <li key={item.uuid}><UserPortrait userInfo={item} size={'default'} showEl={[{selector:'#user-info',display:'block'},{selector:'.group-info-right',display:'block'}]}></UserPortrait></li>
                        })}
                    </ul>
                </Scrollbars>
                <button className={'btn-success'} onClick={this.sendMessage.bind(this)}>发消息</button>
            </div>
        </div>
    }
}
const mapStateGroupInfo = (state)=>{return {groupInfo:state.groupInfo}}
export default connect (mapStateGroupInfo)(GroupInfo)