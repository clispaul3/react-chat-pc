import React from 'react'
import store from '@/store/store'
import { connect } from 'react-redux'
import style_talkArea from './talkArea.scss'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import { Scrollbars } from 'react-custom-scrollbars'
class PointedMessage extends React.Component{
    constructor(props){
        super(props)
    }
    selectFriend(friend){
        const value = $('textarea').val()
        $('textarea').val(value + (friend.remark_name || friend.nickname) +" ")
        $('.pointed-message').hide()
        window.$mentionedFriends.push(friend)
    }
    renderMembersList(){
        if(!this.props.currentConversation){
            return ''
        }
        if(!this.props.groupInfo || this.props.currentConversation.conversationType=='PRIVATE'){
            return ''
        }
        let { members } = this.props.groupInfo
        members = members.filter(item=>{
            return item.uuid!=store.getState().userInfo.uuid
        })
        $('.pointed-message').css({
            height:(members.length>4 ? 4 : members.length)*56,
            top:-226 + (members.length>4 ? 0 : (4-members.length))*56
        })
        return <Scrollbars  className="scroll-container" autoHide autoHideDuration={200}>
            <ul>
                {members.map(item=>{
                    return <li key={item.uuid} className="clearfix" onClick={this.selectFriend.bind(this,item)}>
                        <UserPortrait userInfo={item} size="mini"></UserPortrait>
                        <p>{item.remark_name ? item.remark_name : item.nickname}</p>
                    </li>
                })}
            </ul>
        </Scrollbars>
    }
    render(){
        return <div className="pointed-message">
            {this.renderMembersList.bind(this)()}
        </div>
    }
} 
const mapState = (state)=>{return {groupInfo:state.groupInfo,
    currentConversation:state.currentConversation}}
export default connect (mapState)(PointedMessage)