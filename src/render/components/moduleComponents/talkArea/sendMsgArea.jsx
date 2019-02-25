import React from 'react'
import { Emoji } from '@/rongcloud/emojiInit'
import  ChooseContainer from '@module/chooseContainer/chooseContainer'
import store from '@/store/store'
import { SendTextMessage } from '@/rongcloud/sendTextMsg'
import { Upload } from '@/public/uploadQiniu'
import { dropFile } from './dropFile'
import axios from 'axios'
import { Ajax } from '@/public/ajax'
import { RegisterMessage } from '@/rongcloud/registerMessage'
import { connect } from 'react-redux'
import { toggleMultipleStatus, clearCheckboxStaus,contextmenuObj,
    contextmenuEvent } from '@/store/action'
import { MsgContextmenu } from '@base/handleMenu/messageContextmenu'
import { $host } from '@/utils/config'
import { getCursortPosition,setCurPosition,setSelectText,insertAfterText } from '@/utils/getMousePos'
const { ipcRenderer,clipboard } = window.require('electron')
const { platform } = window.require('os')
import { GifListBox } from '@module/modalBox/gifList'
import PointedMessage from '@module/talkArea/pointedMessage'
export class SendMsgArea extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			shareFriendList:[],
			keycode:{
				ctrl:'0',
				enter:'0',
				command:'0',
				all:'0',
				copy:'0',
				paste:'0'
			},
			importantKeycode:[13,17,91,65,67,86],
			urlCard:{
				url:'',
				title:'',
				desc:'',
				img:''
			},
			curPosition:-1,
			textDom:null,
		}
	}
	componentDidMount(){
		new Emoji()
		dropFile(this.sendFileImgMsg.bind(this,'drop'))
		this.setState({textDom:document.querySelector('textarea')})
	}
	showFileSelectModal(){
		$('.file-input').click()
	}
	toggleEmojiListStatus(str){
		if(str=='show'){
			if($('#modal-emoji-list').html==''){
				new Emoji()
			}
			$('#modal-emoji-list').show()
		}
		if(str=='hide'){
			$('#modal-emoji-list').hide()
		}
	}
	shareCard(){
		this.setState({
			shareFriendList:store.getState().friendList
		},()=>{
			DOMController.showModalBox([{selector:'.container-share-card',display:'block'}])
		})
	}
	renderShareCardContainer(){
		if(this.state.shareFriendList.length==0){
			return
		}else{
			return <ChooseContainer containerTitle={'分享名片'} containerClass={'container-share-card'}
			      searchRange={this.state.shareFriendList}>
				</ChooseContainer>
		}
	}
	sendMsg(){
		const content = this.refs.msgContent.value
		if(window.$overtime==1){
			DOMController.showModalBox([{selector:'.send-message-fail',display:'block'}])
			return
		}
		if(content.trim()==''){
			$('.notice-empty-message').show()
			let timer = window.setTimeout(()=>{
				$('.notice-empty-message').hide()
				clearTimeout(timer)
			},3000)
		}else{
			new SendTextMessage(content).sendMsg()
			$('textarea').val('')
		}
		this.setState({urlCard:{}})
	}
	changeLine(){
		const content = this.refs.msgContent.value
		const { keycode } = this.state
		if(keycode.enter=='1'){
			if(keycode.ctrl=='1' || keycode.command=='1'){
				$('textarea').val(content + '\n')
			}else{
				this.sendMsg()
			}
		}
	}
	setKeycode(num,status){
		let { keycode } = this.state
		switch(num){
			case 13:
				keycode = Object.assign(keycode,{enter:status})
				this.setState({keycode},()=>{
					this.changeLine()
				})
				break;
			case 17:
				keycode = Object.assign(keycode,{ctrl:status})
				this.setState({keycode},()=>{
					this.changeLine()
				})
				break;
			case 91:
				keycode = Object.assign(keycode,{command:status})
				this.setState({keycode},()=>{
					this.changeLine()
				})
				break;
			case 65:
				keycode = Object.assign(keycode,{all:status})
				this.setState({keycode},()=>{
					this.selectAll(keycode)
				})
				break;
			case 67:
				keycode = Object.assign(keycode,{copy:status})
				this.setState({keycode},()=>{
					this.copyContent(keycode)
				})
				break;
			case 86:
				keycode = Object.assign(keycode,{paste:status})
				this.setState({keycode},()=>{
					this.pasteContent(keycode)
				})
				break;
			default:
			    return
		}
	}
	selectAll(keycode){
		if((keycode.ctrl=='1' || keycode.command=='1') && keycode.all=='1'){
			setSelectText(this.state.textDom,0,this.state.textDom.value.length)
		}
	}
	copyContent(keycode){
		if((keycode.ctrl=='1' || keycode.command=='1') && keycode.copy=='1'){
			const text = window.getSelection().toString()
			if(text){
				clipboard.writeText(text, 'selection')
				window.$copyText = text
			}
		}
	}
	pasteContent(keycode){
		if((keycode.ctrl=='1' || keycode.command=='1') && keycode.paste=='1'){
			MsgContextmenu.pasteContent()
		}
	}
	listenKeyCode(str,ev){
		const { keyCode } = ev
		if(str=='up'){
			this.setState({keyCode:Object.assign(this.state.keycode,{enter:'0'})})
		}
		if(keyCode==13){
			ev.preventDefault()
		}
		if(this.state.importantKeycode.indexOf(keyCode)<0){
			return
		}
		this.setKeycode(keyCode,str=='down' ? '1' : '0')
	}
	listenUrl(){
		DOMController.closeAllModalBox()
		let reg = /^(http:\/\/|https:\/\/){0,1}(([a-zA-Z0-9\-]+\.)+(com|cn|net|org|hk|info|biz|mobi|shop|top|tv|ltd|cc|co|wang|tech|group|中国|集团|网址))[^0-9a-zA-Z]*(\:[0-9]*){0,1}((\/|\?){1}[a-zA-Z0-9\.\%\/\?\=\-\&\_\#\+\,]*)*$/g
		let value = $('textarea').val().trim()
		if(value.length>0){
			if(value[value.length-1]=='@' && store.getState().currentConversation.conversationType=='GROUP'){
				$('.pointed-message').show()
			}else{
				$('.pointed-message').hide()
			}
		}else{
			$('.pointed-message').hide()
		}
		value.replace(reg,(a,b,c)=>{
			if(c == $('textarea').val()){
				let timer = window.setTimeout(()=>{
					axios.get(`${$host}` + '/v2/html/dom',{
						params:{
							token:Ajax.user_token,
							url:c
						}
					}).then(res=>{
						clearTimeout(timer)
						if(res.data.status=='0'){
							this.setState({urlCard:''})
						}else{
							this.setState({urlCard:res.data.data})
						}
					})
				},300)
			}else{
				this.setState({urlCard:{}})
			}
		})
		if($('textarea').val()==''){
			this.setState({urlCard:{}})
		}
	}
	errorImgurl(){
		this.refs.urlImg.src = window.$urlDefaultImg
	}
	sendUrlCard(urlCard){
		RegisterMessage.linkCardMessage(urlCard)
		this.setState({urlCard:{}})
		$('textarea').val('')
	}
	contextmenu(ev){
		ev.preventDefault()
		const text = window.getSelection().toString()
		window.$copyText = text
		store.dispatch(contextmenuObj({textarea:true,curPosition:this.state.curPosition}))
		store.dispatch(contextmenuEvent(ev.nativeEvent))
		DOMController.showModalBox([{
			selector:'.handle-menu',display:'block'
		}])
	}
	getCurPostion(){
		const textDom = document.querySelector('textarea')
		const pos = getCursortPosition(textDom)
		this.setState({curPosition:pos})
		DOMController.closeAllModalBox()
	}
	renderUrlCard(){
		if(this.state.urlCard.title){
			const imguri = this.state.urlCard.img=='' ? window.$urlDefaultImg : this.state.urlCard.img
			return <div className={'share-url-card'} onClick={this.sendUrlCard.bind(this,this.state.urlCard)}>
				<p className={'send-url-card'}>单击发送卡片</p>
				<h3>{this.state.urlCard.title}</h3>
				<p className={'url-content'}>{this.state.urlCard.desc}</p>
				<img src={imguri} onError={this.errorImgurl.bind(this)} ref={'urlImg'}/>
			</div>
		}
		if(this.state.urlCard==''){
			return <div className={'not-find-url'}>{'未找到链接信息!'}</div>
		}
	}
	sendFileImgMsg(str,ev){
		const { targetId,conversationType } = store.getState().currentConversation
		const files = str=='input' ? ev.target.files : ev.dataTransfer.files
		let uploadObject = new Upload({files,targetId,conversationType})
        uploadObject.uploadToQiniu()
	}
	closeMultiple(){
		store.dispatch(toggleMultipleStatus(0))
		store.dispatch(clearCheckboxStaus())
	}
	selectMoreOnemsg(){
		const { conMessageList } = store.getState()
		let selectMsg = _.find(conMessageList, item => item.checked==true)
		if(selectMsg==undefined){
			DOMController.showModalBox([{
				selector:'.select-more-one-message',
				display:'block'
			}])
			return false
		}else{
			return true
		}
	}
	transmitMulMsg(){
		window.$transmitMulMsg = 1
		if(this.selectMoreOnemsg()){
			DOMController.showModalBox([{
				selector:'.container-transmit-message',
				display:'block'
			}])
		}
	}
	deleteMulMsg(){
		const { conMessageList } = store.getState()
		if(this.selectMoreOnemsg()){
			_.forEach(conMessageList,item=>{
				if(item.checked){
					MsgContextmenu.deleteMsg(item)
				}
			})
		}
	}
	screenCapture(){
		ipcRenderer.send('capture-screen')
	}
	renderMultipleHtml(){
		if(this.props.multipleStatus==1){
			return <div className={'operate-multiple-message'}>
				<span className={'transmit iconfont icon-fasong'} title={'转发'} onClick={this.transmitMulMsg.bind(this)}></span>
				<span className={'delete iconfont icon-shanchu'} title={'删除'} onClick={this.deleteMulMsg.bind(this)}></span>
				<span className={'iconfont icon-guanbi'} onClick={this.closeMultiple.bind(this)}></span>
			</div>
		}
	}
	render(){
		return <div id={"send-message-area"}>
			{this.renderUrlCard.bind(this)()}
			{this.renderMultipleHtml.bind(this)()}
		    <div className={'area-pannel'}>
			    <GifListBox></GifListBox>
			    <div id={'modal-emoji-list'} className={'overflow-scroll'}
					onMouseOver={this.toggleEmojiListStatus.bind(this,'show')}
					onMouseOut={this.toggleEmojiListStatus.bind(this,'hide')}>
				</div>
			    <div className={'send-emoji-message'} title={'发送表情'}
				    onMouseOver={this.toggleEmojiListStatus.bind(this,'show')}
					onMouseOut={this.toggleEmojiListStatus.bind(this,'hide')}>
				    <span className={'iconfont icon-biaoqing1'}></span>
				</div>
				<div className={'send-file-message'} title={'发送文件'} onClick={this.showFileSelectModal.bind(this)}>
				    <span className={'iconfont icon-wenjian1'}></span>
					<input type='file' className={'file-input'} multiple
					onChange={this.sendFileImgMsg.bind(this,'input')} />
				</div>
				<div className={'share-card-message'}title={'分享名片'} onClick={this.shareCard.bind(this)}>
				    <span className={'iconfont icon-mingpiansvg'}></span>
				</div>
				<div className={'screen-capture'} title={'截图'} onClick={this.screenCapture.bind(this)}>
				    <span className={'iconfont icon-jianqie1'}></span>
				</div>
				<span className={'notice-empty-message'}>
					消息不能为空!
				</span>
				{this.renderShareCardContainer.bind(this)()}
			</div>
			<PointedMessage></PointedMessage>
			<textarea className={'overflow-scroll'} onFocus={DOMController.closeAllModalBox} ref="msgContent"
			    onKeyDown={this.listenKeyCode.bind(this,'down')} onKeyUp={this.listenKeyCode.bind(this,'up')}
				onChange={this.listenUrl.bind(this)} onContextMenu={this.contextmenu.bind(this)}
				onClick={this.getCurPostion.bind(this)}>
			</textarea>
			<p className={'send-notice'}>{`Enter发送,${platform=='darwin' ? 'Command' : 'Ctrl'}+Enter 换行`}</p>
			<button className={'btn-success btn-send-message'} onClick={this.sendMsg.bind(this)}>发送</button>
		</div>
	}
}
const mapState = (state)=>{return {multipleStatus:state.multipleStatus}}
export default connect (mapState)(SendMsgArea)