import axios from 'axios'
import store from '@/store/store'
import { $host } from '@/utils/config'
export function FriendIdentity(uuid){
    axios.get(`${$host}` + '//v2/actual/1',{
        params:{
            token:Ajax.user_token,
            to_user:uuid,
            position:'chat_window',
            search:'actualAll'
        }
    }).then(res=>{
        if(res.data.status=='1'){
            const { identy_validated } = res.data.data.user_info
            const { userInfo } = store.getState()
            if(identy_validated!='2' && userInfo.identy_validated=='2' && res.data.data.user_info.closeHint!=1){
                window.$friendidentity = 1
            }else{
                window.$friendidentity = 0
            }
        }
    })
}