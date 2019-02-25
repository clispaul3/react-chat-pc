import React from 'react'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import { Friend } from '@/class/Friend'
import store from '@/store/store'
import _ from 'lodash'
import msgListStyle from './message.scss'
import { formatMsgSentTime } from '@/public/formatMsgSentTime'
const { shell,ipcRenderer } = window.require('electron')
import '@static/lib/jquery.magnify.min.js'
import { CreateVideo } from '@/assets/jqueryVideo/js/fz-video.js'
import voice1 from '@/assets/voice-1.gif'
import voice2 from '@/assets/voice-2.gif'
import $ from 'jquery'
import { DOMController } from '@/class/DOMController'
import { fileSize } from '@/utils/fileSize'
import { fileName } from '@/utils/fileName'
import { playVoice } from '@/rongcloud/playVoice'
import { getFriendInfo,contextmenuObj,contextmenuEvent } from '@/store/action'
import identityImg from '@/assets/identity.png'
import { Checkbox } from 'element-react'
import { connect } from 'react-redux'
import { toggleCheckboxStatus } from '@/store/action'
import { saveImage } from '@/utils/saveImage'
import { saveFile } from '@/utils/saveFile'
import { startTimerInterval } from '@/utils/voiceLoadtimer'
/**
   消息展示类型：
     1）展示类消息
     2）提示类消息
   消息展示内容：
     1）消息时间 2）消息内容 3）发送者头像
   props:
     showMsgSentTime(String): '1' 显示 ‘0’ 不显示
*/
export class MessageContainer extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          userInfo:store.getState().userInfo,
          imageUri:'',
          commonObjName:['RC:TxtMsg','RC:ImgMsg','RC:FileMsg','RC:VcMsg','RC:LBSMsg',
            'WY:CallNotificationMessage','RC:SightMsg','RCBQMM:GifMsg','RCBQMM:EmojiMsg'],
          specialObjName:['RC:CardMsg','RC:GrpNtf','WY:FriendHandle','WY:UploadpicNotification',
            'WY:IdentityNotification'],
          receiveOrSendMsg:['WY:ShareReportMessage','WY:CallNotificationMessage',
            'WY:RedPacketMessage','RC:RcCmd'],
          checked:false,
          timeinterval:null
        }
    }
    componentDidMount(){
      $("[data-magnify=gallery]").magnify({
        callbacks: {
          opened: function(el){
            const { conMessageList } = store.getState()
            // ipcRenderer.send('image-list','list-list-list')
            $('.magnify-modal i.icon-xiazai1').bind('click',function(){
              for(let msg of conMessageList){
                if(msg.objectName=='RC:ImgMsg'){
                  if(decodeURIComponent(msg.content.imageUri)==decodeURIComponent(el[0].src)){
                    saveImage(msg.content.content)
                  }
                }
              }
            })
            $('.magnify-button-fullscreen').hide()
            $('.magnify-button-actual-size').hide()
            $('.magnify-button-next .iconfont').css({fontSize:'14px'})
            $('.magnify-button-prev .iconfont').css({fontSize:'14px'})
            $('.magnify-button-zoom-out .iconfont').css({fontSize:'19px',top:'2px',position:'relative'})
          }
        }
      })
      const elA = document.querySelectorAll('.open-url')
      for(let i=0;i<elA.length;i++){
        elA[i].onclick = function(ev){
          shell.openExternal(ev.target.innerText)
        }
      }
    }
    componentWillReceiveProps(){
      const { objectName } = this.props.message
      if(objectName=='RC:ImgMsg'){
        const { imageUri } = this.props.message.content
        this.setState({imageUri})
      }
      if(Object.keys(this.props.message).indexOf('checked')>=0){
        this.setState({checked:this.props.message.checked})
      }
    }
    // 处理顺序：当前声音是否正在播放 ? 暂停播放 : 关闭其他声音，同时播放当前声音
    playVoiceMsg(){
      const { content } = this.props.message
      const { display } = this.refs.voiceContainer.querySelector('img').style
      const playCurrentVoice = ()=>{
        $('.voice-message img').hide()
        $('.voice-message .iconfont').show()
        window.$voiceFile = content.content
        this.refs.voiceContainer.querySelector('img').style.display = 'block'
        this.refs.voiceContainer.querySelector('.iconfont').style.display = 'none'
        playVoice(content.content,this.props.message)
        window.$vocieTimer = window.setTimeout(()=>{
          window.$voiceFile = ''
          this.refs.voiceContainer.querySelector('img').style.display = 'none'
          this.refs.voiceContainer.querySelector('.iconfont').style.display = 'block'
          clearTimeout(window.$vocieTimer)
        },content.duration*1000)
      }
      if(window.$vocieTimer){
        clearTimeout(window.$vocieTimer)
      }
      if(window.$voiceFile){
        RongIMLib.RongIMVoice.stop(window.$voiceFile)
        if(display=='block'){
          this.refs.voiceContainer.querySelector('img').style.display = 'none'
          this.refs.voiceContainer.querySelector('.iconfont').style.display = 'block'
          window.$voiceFile = ''
        }else{
          playCurrentVoice()
        }
      }else{
        playCurrentVoice()
      }
    }
    // 播放小视频-->弹出播放窗口
    playVideo(){
      const { sightUrl } = this.props.message.content
      if(window.$currentVideo){
        window.$currentVideo.setUrl(sightUrl)
        ipcRenderer.send('video-url',sightUrl)
      }else{
        window.$currentVideo = new CreateVideo(
          "container-video",	//容器的id
          {
            url: sightUrl,
            autoplay	: true
          }
        )
        ipcRenderer.send('video-url',sightUrl)
      }
      return
      DOMController.showModalBox([{
        selector:'.box-play-video-msg',display:'block'
      }])
    }
    // 照片查看器
    showImgZoom(){
      const { conMessageList } = store.getState()
      let imgList = []
      for(let item of conMessageList){
        if(item.objectName=='RC:ImgMsg'){
          imgList.push(item.content.imageUri)
        }
      }
      let idx = imgList.indexOf(this.props.message.content.imageUri)
      // ipcRenderer.send('image-list',imgList,idx)  在新窗口中查看图片
    }
    downloadFile(url,str){
      saveFile(url)
    }
    showFriendInfo(){
      const { userId } = this.props.message.content
      Friend.getFriendInfo(userId).then(info=>{
        store.dispatch(getFriendInfo(info))
        DOMController.showModalBox([{selector:'#user-info',display:'block'}])
      })
    }
    contextmenu(ev){
      ev.preventDefault()
      store.dispatch(contextmenuObj(this.props.message))
      store.dispatch(contextmenuEvent(ev.nativeEvent))
      DOMController.showModalBox([{
        selector:'.handle-menu',display:'block'
      }])
      window.$copyText = window.getSelection().toString()
    }
    renderMsgSentTime(){
      const { sentTime } = this.props.message
      const { showMsgSentTime } = this.props
      if(showMsgSentTime=='1'){
        return <p className={'msg-sent-time'}>{formatMsgSentTime(sentTime)}</p>
      }else{
        return <p className={'msg-sent-time'}></p>
      }
    }
    openUrl(url){
      shell.openExternal(url)
    }
    errorImgurl(){
      this.refs.urlImg.src = window.$urlDefaultImg
    }
    renderMsgReadstatus(){
      const { currentConversation } = store.getState()
      if(currentConversation && this.props.message.messageDirection==1){
        if(currentConversation.lastReadtime && currentConversation.conversationType=='PRIVATE'){
          const readStatus = currentConversation.lastReadtime>=this.props.message.sentTime
          return <i className={'read-status'} style={{color:readStatus ? '#ddd' : '#4a90e2'}}>
              {readStatus ? '已读' : '送达'}
          </i>
        }
      }
    }
    renderVoiceToText(){
      if(this.props.message.showTextContent=='1'){
        const { textContent } = this.props.message
        let content = ''
        if(textContent=='~~~'){
          startTimerInterval()
          content = <span className={'iconfont icon-dengdai'}></span>
        }
        else if(textContent=='***'){
          content = <span className={'icon-fail'}>转换失败</span>
        }else{
          content = textContent
        }
        return <p className={'text-content'}>
          {/* {this.props.message.textContent} */}
          {/* <span className={'iconfont icon-dengdai'}></span> */}
          {content}
        </p>
      }
    }
    renderMsgContent(){
      const { objectName } = this.props.message
      if(this.state.receiveOrSendMsg.indexOf(objectName)>=0){
        return <p className={'group-notification-message'}>
            {this.props.message.content.content}
          </p>
      }
      if(objectName=='WY:IdentityNotification'){
        const { messageDirection } = this.props.message
        const { currentConversation } = store.getState()
        if(messageDirection==1){
          return <div className={'identity-notification-message-'+ messageDirection + ' clearfix'} 
            onContextMenu={this.contextmenu.bind(this)}>
            <span className={'iconfont icon-fenzu'}></span>
            <p>{'您已成功邀请' + '"' + currentConversation.nickname + '"进行实人认证'}</p>
          </div>
        }
        if(messageDirection==2){
          return <div className={'identity-notification-message-'+messageDirection}
            onContextMenu={this.contextmenu.bind(this)}>
            <img src={identityImg} alt=""/>
          </div>
        }
      }
      if(objectName=='WY:UploadpicNotification'){
        const { messageDirection } = this.props.message
        let content = messageDirection==1 ? '您已成功发送上传照片提醒' : "无图无真相，提醒您在App'我的->个人资料'中上传照片，展示最美的自己"
        return <p className={'group-notification-message'}>
            {content}
          </p>
      }
      if(objectName=='WY:ShareLinkContentMessage'){
        return <div className={'share-card-url-message'} onClick={this.openUrl.bind(this,this.props.message.content.url)}
          onContextMenu={this.contextmenu.bind(this)}>
          <h3>{this.props.message.content.title}</h3>
          <p>{this.props.message.content.desc}</p>
          <img src={this.props.message.content.img} onError={this.errorImgurl.bind(this)} ref={'urlImg'}/>
          {this.renderMsgReadstatus.bind(this)()}
        </div>
      }
      if(objectName=='RC:CardMsg'){
        const { content } = this.props.message
        return <div className={'share-card-message'} onClick={this.showFriendInfo.bind(this)}
            onContextMenu={this.contextmenu.bind(this)}>
            <img src={content.portraitUri} alt=""/>
            <span>{fileName('card',content.name)}</span>
            {this.renderMsgReadstatus.bind(this)()}
            <p>个人名片</p>
        </div>
      }
      if(objectName=='RCBQMM:EmojiMsg'){
        if(this.props.message.gifuri){
          return <div className={'emojigif-message'} onContextMenu={this.contextmenu.bind(this)}>
            <img src={this.props.message.gifuri} alt=""/>
            {this.renderMsgReadstatus.bind(this)()}
          </div>
        }
      }
      if(objectName=='RCBQMM:GifMsg'){
        const { content } = this.props.message
        const gifuri = JSON.parse(content.bqmmExtra).msg_data.sticker_url
        return <div className={'gif-message'} onContextMenu={this.contextmenu.bind(this)}>
           <img src={gifuri} alt=""/>
           {this.renderMsgReadstatus.bind(this)()}
        </div>
      }
      if(objectName=='RC:StkMsg'){
        if(this.props.message.gifuri){
          return <div className={'gif-message'} onContextMenu={this.contextmenu.bind(this)}>
              <img src={this.props.message.gifuri} alt="" style={{width:'120px',height:'120px',marginTop:'-10px'}}/>
              {this.renderMsgReadstatus.bind(this)()}
            </div>
        }
      }
      if(objectName=='RC:SightMsg'){
        const { sightUrl } = this.props.message.content
        return <div className={'video-message'} onContextMenu={this.contextmenu.bind(this)}>
            <video src={sightUrl} onClick={this.playVideo.bind(this)}></video>
            <span onClick={this.playVideo.bind(this)} 
              className={'iconfont icon-bofang1'}>
            </span>
            {this.renderMsgReadstatus.bind(this)()}
        </div>
      }
      if(objectName=='RC:TxtMsg'){
        let { content } = this.props.message.content
        let reg = /^(http:\/\/|https:\/\/){0,1}(([a-zA-Z0-9\-]+\.)+(com|cn|net|org|hk|info|biz|mobi|shop|top|tv|ltd|cc|co|wang|tech|group|中国|集团|网址)):{0,1}[0-9]*[a-zA-Z0-9\.\%\/\?\=\-\&\_\#\+]*$/g
        content = content.replace(/\n/g,'<br>')
        content = content.replace(/\s/g,'&nbsp;')
        let url = content.match(reg)
        if(url){
          url = url[0]
          let _url = url
          if(url.indexOf('http://')<0 && url.indexOf('https://')<0){
            _url = 'http://' + url
          }
          let aTag = '<a style="color:#4A90E2;cursor:pointer;" class="open-url">' + _url + '</a>'
          content = content.replace(url,aTag)
        }
        return <div className={'text-message'}>
            <p  onContextMenu={this.contextmenu.bind(this)}
              dangerouslySetInnerHTML={{__html: RongIMLib.RongIMEmoji.emojiToHTML(content)}}>
            </p>
            {this.renderMsgReadstatus.bind(this)()}
          </div>
      }
      if(objectName=='RC:FileMsg'){
        const { content } = this.props.message
        return <div className={'file-message'} onClick={this.downloadFile.bind(this,content.fileUrl,'file')}
          onContextMenu={this.contextmenu.bind(this)}>
          <span className={'name'}>{fileName('file',content.name)}</span>
          <br/>
          <span className={'size'}>{fileSize(content.size)}</span>
          <span className={'iconfont icon-wenjian2'}></span>
          {this.renderMsgReadstatus.bind(this)()}
        </div>
      }
      if(objectName=='RC:ImgMsg'){
        const { imageUri } = this.props.message.content
        return <div className={'image-message clearfix'} onContextMenu={this.contextmenu.bind(this)}>
            <img src={imageUri} data-magnify="gallery" data-src={imageUri} onClick={this.showImgZoom.bind(this)}/>
            {this.renderMsgReadstatus.bind(this)()}
          </div>
      }
      if(objectName=='RC:LBSMsg'){
        const { senderUserId } = this.props.message
        return <p className={'group-notification-message'}>
            {(senderUserId==this.state.userInfo.uuid ? '发出' : '收到') + '定位消息，请在手机上查看'}
          </p>
      }
      if(objectName=='RC:VcMsg'){
        const { messageDirection,content } = this.props.message
        return <div className={'voice-message'} ref={'voiceContainer'}
            onClick={this.playVoiceMsg.bind(this)} onContextMenu={this.contextmenu.bind(this)}>
            <p>
              <span className={'time'}>{content.duration + '"'}</span>
              <span className={'iconfont icon-yuyinxiaoxi'}></span>
              {this.renderMsgReadstatus.bind(this)()}
            </p>
            <img src={messageDirection==1 ? voice1 : voice2} alt=""/>
            {(this.props.message.isListened!='1' && messageDirection==2) ? <span className={'listened-status'}></span> : ''}
            {this.renderVoiceToText.bind(this)()}
          </div>
      }
      if(objectName=='WY:FriendHandle'){
        const { messageDirection } = this.props.message
        const str1 = messageDirection==1 ? '您' : '对方'
        const str2 = messageDirection==1 ? '对方' : '您'
        return <p className={'group-notification-message'}>
            { str1 + '已同意' + str2 + '的好友请求，现在可以开始聊天了'}
          </p>
      }
      if(objectName=='RC:GrpNtf'){
        const { operation,operatorUserId } = this.props.message.content
        const { operatorNickname } = this.props.message.content.data
        if(operation=='Add'){
          const {targetUserDisplayNames} = this.props.message.content.data
          return <p className={'group-notification-message'}>
              {(this.state.userInfo.uuid == operatorUserId ? '你' : operatorNickname) + '邀请' + targetUserDisplayNames.join(',') + '加入群聊'}
            </p>
        }
        if(operation=='Kicked'){
          const {targetUserDisplayNames} = this.props.message.content.data
          return <p className={'group-notification-message'}>
              {(this.state.userInfo.uuid == operatorUserId ? '你' : operatorNickname) + '将' + targetUserDisplayNames.join(',') + '移出群聊'}
            </p>
        }
        if(operation=='Rename'){
          const { targetGroupName } = this.props.message.content.data
          return <p className={'group-notification-message'}>
              {(this.state.userInfo.uuid == operatorUserId ? '你' : operatorNickname) + '修改群名称为：' + targetGroupName}
            </p>
        }
        if(operation=='Quit'){
          const {targetUserDisplayNames} = this.props.message.content.data
          return <p className={'group-notification-message'}>
              {targetUserDisplayNames.join(',') + '退出了群聊'}
            </p>
        }
      }
    }
    renderMsgPortrait(){
      const { messageDirection,conversationType,targetId,senderUserId,objectName } = this.props.message
      const { friendList,groupInfo } = store.getState()
      const showEl = [{selector:'#user-info',display:'block'}]
      const hideUserPortrait = [...this.state.receiveOrSendMsg,'RC:LBSMsg','WY:FriendHandle',
        'WY:UploadpicNotification','WY:IdentityNotification'] 
      if(hideUserPortrait.indexOf(objectName)>=0){
        return
      }
      if(conversationType==1){
        if(messageDirection==1){
          return <UserPortrait userInfo={this.state.userInfo} showEl={showEl}></UserPortrait>
        }else{
          const friendInfo = _.find(friendList,item => item.targetId==targetId)
          return <UserPortrait userInfo={friendInfo} showEl={showEl}></UserPortrait>
        }
      }
      if(conversationType==3){
        if(objectName=='RC:GrpNtf'){
          return
        }
        if(messageDirection==1){
          return <UserPortrait userInfo={this.state.userInfo} showEl={showEl}></UserPortrait>
        }else{
          const memberInfo = groupInfo ? _.find(groupInfo.members,item => item.uuid == senderUserId) : undefined
          if(memberInfo){
            return <UserPortrait userInfo={memberInfo} showEl={showEl}></UserPortrait>
          }else{
            return <UserPortrait showEl={showEl}></UserPortrait>
          }
        }
      }
    }
    changeChecked(val){
      this.setState({checked:val},()=>{
        const { messageUId, sentTime } = this.props.message
        store.dispatch(toggleCheckboxStatus(messageUId, sentTime, val))
      })
    }
    renderCheckbox(){
      if(this.props.multipleStatus==1){
        return <Checkbox onChange={this.changeChecked.bind(this)} checked={this.state.checked}></Checkbox>
      }
    }
    render(){
      return <div className={this.props.message.messageDirection==1 ? 'message-container msg-from-me clearfix' : 'message-container msg-from-friend clearfix'}>
          {this.renderMsgSentTime.bind(this)()}
          {this.renderMsgPortrait.bind(this)()}
          {this.renderMsgContent.bind(this)()}
          {this.renderCheckbox.bind(this)()}
        </div>
    }
}
const mapState = (state)=>{return {multipleStatus:state.multipleStatus}}
export default connect (mapState)(MessageContainer)
