/**
  messageList:当前会话的历史消息
*/
import React from 'react'
import MessageContainer from './messageContainer'
import store from '@/store/store'
import msgListStyle from './message.scss'
import { Scrollbars } from 'react-custom-scrollbars'
import { DOMController } from '@/class/DOMController'
import { getHistoryMessage } from '@/rongcloud/getHistoryMessage'
import { MessageType } from '@/rongcloud/messageType'
import _ from 'lodash'
import style_magnify from '@static/lib/jquery.magnify.min.css'
import authIndectityIcon from '@/assets/auth-notice.png'
import { Friend } from '@/class/Friend'
import { RegisterMessage } from '@/rongcloud/registerMessage'
import deletemsg_db from '@/localdb/deletemsg'
import { connect } from 'react-redux'

export class MessageList extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        hasMsg:true,
        messageList:[],
        hasNewMsgStatus:false,
        latestMsgSentTime:0,
        countdown:[],
        showBlank:0,
        showOvertimeNotice:0,
        showFriendIdentity:0
      }
    }
    componentWillReceiveProps(nextProps){
      this.setState({hasMsg:true})
      let messageList = _.uniqBy(store.getState().conMessageList,'sentTime').sort((msgA,msgB)=>{
        return parseInt(msgA.sentTime)-parseInt(msgB.sentTime)
      })
      this.setState({messageList})
      if(messageList.length>0){
        const { sentTime } = messageList[messageList.length-1]
        if(this.state.latestMsgSentTime!=sentTime){
          this.setState({latestMsgSentTime:sentTime})
          if(this.refs.scrollMsgList.getValues().top!=1 && this.refs.scrollMsgList.getValues().scrollTop>0){
            this.setState({hasNewMsgStatus:true})
          }else{
            let timer = window.setTimeout(()=>{
              this.scrollToBottom()
              clearTimeout(timer)
            },300)
          }
        }
      }
      let timer = window.setTimeout(()=>{
        if(window.$friendidentity==1){
          this.setState({showFriendIdentity:1,showBlank:1},()=>{
            $('.blank-default').css({
              height:'30px'
            })
          })
        }
        if(window.$friendidentity!=1 && window.$countdown.length==0 && window.$overtime!=1){
          this.setState({showFriendIdentity:0,showBlank:0})
        }
        clearTimeout(timer)
      },500)
      
    }
    componentDidMount(){
      window.scrollMessageList = this.refs.scrollMsgList
      let timer = window.setTimeout(()=>{
        if(window.$countdown.length>0){
          this.setState({showBlank:1})
          window.$countdown1 = window.setInterval(()=>{
            this.setState({countdown:window.$countdown,showBlank:1})
          },1000)
        }
        clearTimeout(timer)
      },1000)
      if(window.$overtime=='1'){
        this.setState({showBlank:1,showOvertimeNotice:1},()=>{
          $('.blank-default').css({
            height:'30px'
          })
        })
      }
    }
    loadingMoreMsg(ev,values){
      DOMController.closeAllModalBox()
      if(this.refs.scrollMsgList.getValues().top==1){
        this.setState({hasNewMsgStatus:false})
      }
      const topDistance = this.refs.scrollMsgList.getScrollTop()
      const { currentConversation } = store.getState()
      const handleMessge = (list)=>{
        _.forEachRight(list,item => {
          if(window.$syncMsg=='2' && window.$loginTime>item.sentTime){
            return
          }
          if((window.$loginTime-item.sentTime)<1000*60*60*24*5){
            new MessageType(item,'loading-more-msg')
          }else{
            this.setState({hasMsg:false},()=>{
              let timer = window.setTimeout(()=>{
                DOMController.showModalBox([{selector:'.modal-before-five-days-msg',display:'block'}])
                clearTimeout(timer)
              },100)
            })
          }
        })
      }
      if(topDistance==0){
        if(this.state.hasMsg){
          if(currentConversation==null){
            this.setState({hasMsg:true})
            return
          }
          getHistoryMessage(currentConversation.targetId,null).then(res=>{
            if(res.hasMsg==false){
              this.setState({hasMsg:false},()=>{
                if(res.list.length>0){
                  handleMessge(res.list)
                }
              })
            }
            if(res.hasMsg){
              handleMessge(res.list)
              this.refs.scrollMsgList.scrollTop(200)
            }
          })
        }
      }
    }
    scrollToBottom(){
      this.refs.scrollMsgList.scrollToBottom()
      this.setState({hasNewMsgStatus:false})
    }
    closeNotice(idx){
      switch(idx){
        case '1':
          clearInterval(window.$countdown1)
          clearInterval(window.$countdown2)
          this.setState({countdown:[],showBlank:0})
          break
        case '2':
          this.setState({showBlank:0,showOvertimeNotice:0})
          break
        case '3':
          this.setState({showBlank:0,showFriendIdentity:0},()=>{
            const { currentConversation } = store.getState()
            Friend.closeFriendIdtentity(currentConversation.targetId)
          })
          break
        default:
          break
      }
    }
    renderIconUnreadMsg(){
      if(this.state.hasNewMsgStatus){
        return <div className={'has-new-message'} onClick={this.scrollToBottom.bind(this)}>
            <p>
              <span className={'iconfont icon-shoushidianji-copy'}></span>
              <span>你有新消息</span>
            </p>
        </div>
      }
    }
    renderOvertime(){
      if(this.state.showOvertimeNotice==1){
        return <div className={'over-time'}>
          <span>{'已经暂停聊天服务，完成实人认证恢复聊天功能'}</span>
          <span className={'iconfont icon-guanbi'} onClick={this.closeNotice.bind(this,'2')}></span>
        </div>
      }
    }
    renderIndentyNotice(){
      if(this.state.countdown.length!=0){
        return <div className={'indentity-notice-countdown'} ref={'countdownTag'}>
          <span>请前往9号米仓App进行实人认证，剩余</span>
          <span className={"time"}>
              <i>{this.state.countdown[0]}</i>天
              <i>{this.state.countdown[1]}</i>时
              <i>{this.state.countdown[2]}</i>分
              <i>{this.state.countdown[3]}</i>秒
          </span>
          <span className={"notice"}>
              <img src={authIndectityIcon}/>
              <span className={"triangle iconfont icon-triangle-right"}></span>
          </span>
          <span className={"iconfont icon-guanbi"} onClick={this.closeNotice.bind(this,'1')}></span>
        </div>
      }
    }
    sendIdentityMsg(){
      const { userInfo,currentConversation } = store.getState()
      RegisterMessage.remindAuthentication({
        receiverUUID:currentConversation.targetId,
        senderUUID:userInfo.uuid,
        tipsContent:'',
      })
    }
    renderFriendIdentity(){
      if(this.state.showFriendIdentity==1){
        return <div className={'friend-identity'}>
          <span>{'Ta未认证身份，请谨慎聊天'}</span>
          <span onClick={this.sendIdentityMsg.bind(this)}>{'提醒Ta认证'}</span>
          <span className={'iconfont icon-guanbi'} onClick={this.closeNotice.bind(this,'3')}></span>
        </div>
      }
    }
    render(){
      return <div style={{flex:1,width:'100%',position:'relative'}} className={'message-list'}>
        <Scrollbars style={{ width:'100%', height:'100%',left:0 }}  autoHide autoHideDuration={200}
            className={'scroll-message-list scroll-container'} ref={'scrollMsgList'}
            onScroll={this.loadingMoreMsg.bind(this)}>
            {this.state.showBlank==1 ? <div className={'blank-default'}></div> : ''}
            <div id="conversation-message-list">
                {this.state.messageList.map((item,idx)=>{
                    let showMsgSentTime = '0'
                    if(idx==0){
                      showMsgSentTime = '1'
                    }
                    if(idx>0){
                      const compareRes = (this.state.messageList[idx].sentTime - this.state.messageList[idx-1].sentTime)>1000*60*3
                      showMsgSentTime = compareRes ? '1' : '0'
                    }
                    return <MessageContainer message={item} key={item.messageUId ? item.messageUId : item.messageId + item.sentTime} showMsgSentTime={showMsgSentTime}>
                        </MessageContainer>
                })}
            </div>
        </Scrollbars>
        {this.renderIndentyNotice.bind(this)()}
        {this.renderIconUnreadMsg.bind(this)()}
        {this.renderOvertime.bind(this)()}
        {this.renderFriendIdentity.bind(this)()}
      </div>
    }
}
const mapState = (state)=>{return {conMessageList:state.conMessageList,currentConversation:state.currentConversation}}
export default connect (mapState)(MessageList)
