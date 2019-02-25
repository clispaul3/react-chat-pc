import voicemsg_db from '@/localdb/voicemsg'
import store from '@/store/store'
import { updateListenedStatus } from '@/store/action'
let RongIMVoice = RongIMLib.RongIMVoice
RongIMVoice.init()
export function playVoice(voice,message){
    if(voice){
        var duration = voice.length/1024;    // 音频持续大概时间(秒)
        RongIMVoice.preLoaded(voice, function(){
            RongIMVoice.play(voice,duration);
        })
        const { userInfo } = store.getState()
        let params = {
            msgId:userInfo.uuid + '~~~' + message.messageUId,
            isListened:'1'
        }
        voicemsg_db.update_isListened(params,res=>{
            if(res.rowsAffected>=1){
                store.dispatch(updateListenedStatus(message.messageUId))
            }
        })
    }else{
        console.error('请传入 amr 格式的 base64 音频文件');
    }
}