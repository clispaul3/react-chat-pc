/**
 * mentionedInfo.type(number) 2:不是所有人 1:所有人
 **/
import async from 'async'
import _ from 'lodash'
import store from '@/store/store'
import { Group } from '@/class/Group'
export function mentionedMsg(message,callback){
    let { mentionedInfo } = message.content
    if(mentionedInfo.type==2){
        let nameArr = message.content.content.match(/@\S+/g,'@')
        const { uuid } = store.getState().userInfo
        let fnArr = _.map(mentionedInfo.userIdList,(o)=>{
            if(uuid==o){
                return function(callback){
                    Group.getGroupInfo(message.targetId).then(res=>{
                        const info = _.find(res.members,(item)=>item.uuid==uuid)
                        callback(null,info)
                    })
                }
            }else{
                return function(callback){
                    Friend.getFriendInfo(o).then(info=>{
                        callback(null,info)
                    })
                }
            }
        })
        async.parallel(fnArr,(errors,results)=>{
            let content = ''
            for(let i=0;i<nameArr.length;i++){
                for(let j=0;j<results.length;j++){
                    if(mentionedInfo.userIdList[i]==results[j].uuid){
                        let name = mentionedInfo.userIdList[i]!=uuid ? (results[j].remark_name || results[j].nickname) : results[j].remark_name
                        let mentionName = new RegExp(nameArr[i],'g')
                        content = message.content.content.replace(mentionName,'@'+name)
                    }
                }
            }
            console.log(content)
            callback(content)
        })            
    }
}























