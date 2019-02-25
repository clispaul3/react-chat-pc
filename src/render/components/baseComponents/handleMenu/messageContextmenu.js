import _ from 'lodash'
import store from '@/store/store'
import { handleMsgStepOne } from '@/rongcloud/messagestepOne'
import deletemsg_db from '@/localdb/deletemsg'
import { deleteOneMessage } from '@/store/action'
const { clipboard } = window.require('electron')
import { insertAfterText } from '@/utils/getMousePos'
import { Upload } from '@/public/uploadQiniu'
import { saveImage } from '@/utils/saveImage'
import { saveFile } from '@/utils/saveFile'
import { MessageType } from '@/rongcloud/messageType'
import { Ajax } from '@/public/ajax'
import { updateTextContent,toggleTextContent,updateListenedStatus } from '@/store/action'
import voicemsg_db from '@/localdb/voicemsg'
import { TransmitMessage } from '@/rongcloud/transmitMsg'
export class MsgContextmenu{
    constructor(message){
        this.message = message
        this.menu = ['复制','保存','删除','转发','多选']
    }
    contextmenu(){
        const { objectName } = this.message
        let myself = this.message.messageDirection==1 ? true : false
        if(new Date().getTime()>=(this.message.sentTime + 120000)){
            myself = false
        }
        const showAll = ['RC:ImgMsg','RC:FileMsg']
        const notSave = ['RC:TxtMsg',,'RC:VcMsg']
        const onlyRecallDel = ['WY:IdentityNotification']
        const notCopySave = ['RCBQMM:GifMsg','RCBQMM:EmojiMsg','RC:StkMsg',
            'WY:ShareLinkContentMessage','RC:SightMsg','RC:CardMsg']
        if(showAll.indexOf(objectName)>=0){
            const menu = ['保存','删除','转发','多选']
            return myself ? [...menu,'撤回'] : menu
        }
        if(notSave.indexOf(objectName)>=0){
            let menu = myself ? [..._.filter(this.menu,item => item!='保存'),'撤回'] : _.filter(this.menu,item => item!='保存')
            if(objectName=='RC:VcMsg'){
               menu = _.concat(menu,this.message.showTextContent!='1' ? '转文字' : '收起文字').filter(item=>item!='复制')
            }
            return menu
        }
        if(onlyRecallDel.indexOf(objectName)>=0){
            return myself ? ['撤回','删除','多选'] : ['删除','多选']
        }
        if(notCopySave.indexOf(objectName)>=0){
            let menu = myself ? ['撤回','删除','转发','多选'] : ['删除','转发','多选']
            if(objectName=='RC:SightMsg'){
                menu.shift('保存')
                menu.unshift('删除')
            }
            if(objectName=='RC:CardMsg'){
                menu = menu.filter(item => item!= '转发')
            }
            return menu
        }
    }
    // 收到的消息messageUId:undefined targetId:userInfo.uuid
    static withdrawMsg(message){
        if(new Date().getTime() <= (message.sentTime + 120000)){
            RongIMClient.getInstance().sendRecallMessage(message, {
                onSuccess: function (msg) {
                    msg.targetId = msg.content.targetId
                    handleMsgStepOne(msg)
            },
                onError: function (errorCode) {
                    console.log("撤回失败" + errorCode)
            }})
        }
    }
    static deleteMsg(message){
        const { userInfo,currentConversation } = store.getState()
        deletemsg_db.insert_one_msg({
            msgId: userInfo.uuid + '~~~' + message.messageUId,
            senderUserId:userInfo.uuid,
            targetId:currentConversation.targetId
        },res=>{
            if(res.rowsAffected>=1){
                store.dispatch(deleteOneMessage(message.messageUId))
                const { conMessageList } = store.getState()
                new MessageType(conMessageList[conMessageList.length-1],'login')
            }
        })
    }
    static transmitMsg(choosedFriend){
        if(window.$transmitMulMsg==0){
            const { contextmenuObj } = store.getState().contextmenu
            new TransmitMessage([contextmenuObj],choosedFriend)
        }
        if(window.$transmitMulMsg==1){
            const { conMessageList } = store.getState()
            let choosedMessage = []
            _.forEach(conMessageList,item=>{
                if(item.checked){
                    choosedMessage.push(item)
                }
            })
            new TransmitMessage(choosedMessage,choosedFriend)
        }
    }
    static copyMsg(message){
        if(window.$copyText){
            clipboard.writeText(window.$copyText, 'selection')
        }
        window.$copyText = ''
    }
    static pasteContent(){
        // 粘贴图片
        if(clipboard.readImage().toDataURL() && clipboard.readImage().toDataURL()!='data:image/png;base64,'){
            let urlData = clipboard.readImage().toDataURL()
            var bytes = window.atob(urlData.split(',')[1])
            var ab = new ArrayBuffer(bytes.length)
            var ia = new Uint8Array(ab)
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i)
            }
            let image = new Blob( [ab] , {type : 'image/png'})
            image.name = '9号米仓_' + new Date().getTime() + '.png'
            if(window.$overtime==1){
                DOMController.showModalBox([{selector:'.send-message-fail',display:'block'}])
                return
            }
            const { targetId,conversationType } = store.getState().currentConversation
            const files = [image]
            let uploadObject = new Upload({files,targetId,conversationType})
            uploadObject.uploadToQiniu()
        }else{
            const textDom = document.querySelector('textarea')
            const text = clipboard.readText()
            insertAfterText(textDom,text)
        }
    }
    static saveFileImg(contextmenuObj){
        if(contextmenuObj.objectName=='RC:FileMsg'){
            saveFile(contextmenuObj.content.fileUrl)
        }
        if(contextmenuObj.objectName=='RC:ImgMsg'){
            saveImage(contextmenuObj.content.content)
        }
    }
    static voiceToText(message){
        const msgId = store.getState().userInfo.uuid + '~~~' + message.messageUId
        if(message.objectName=='RC:VcMsg'){
            if(message.isListened!='1'){
                let params = { msgId, isListened:'1' }
                voicemsg_db.update_isListened(params,res=>{
                    if(res.rowsAffected>=1){
                        store.dispatch(updateListenedStatus(message.messageUId))
                    }
                })
            }
            if(message.textContent==''){
                store.dispatch(updateTextContent(message.messageUId,'~~~'))
                store.dispatch(toggleTextContent(message.messageUId,'1'))
                voicemsg_db.select_one({msgId},res=>{
                    if(res.rows.length>=1){
                        const result = res.rows[0]
                        if(result.textContent!=''){
                            store.dispatch(updateTextContent(result.msgId,result.textContent))
                        }else{
                            Ajax.voiceToText(message,res=>{
                                if(res.status=='1'){
                                    console.log(res.data.translate[0],res.data.message_id)
                                    store.dispatch(updateTextContent(res.data.message_id,res.data.translate[0]))
                                    voicemsg_db.update_textContent({
                                        msgId,textContent:res.data.translate[0]
                                    },res=>{})
                                }else{
                                    console.log('翻译失败',res.data.message_id)
                                    voicemsg_db.update_textContent({
                                        msgId,textContent:'***'
                                    },res=>{})
                                    store.dispatch(updateTextContent(res.data.message_id,'***'))
                                }
                            })
                        }
                    }
                })
            }else{
                store.dispatch(toggleTextContent(message.messageUId,'1'))
            }
        }
    }
    static hideVcText(message){
        store.dispatch(toggleTextContent(message.messageUId,'0'))
    }
}