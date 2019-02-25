import store from '@/store/store'
import { pinyin } from '@static/lib/convert_pinyin'
import { localSearchResult,clearLocalSearchResult } from '@/store/action'

export class LocalSearch{
    constructor(params){
        this.searchContent = params.content
		this.searchRange = params.searchRange
		this.pinyin = pinyin()
        this.init()
        this.searchResult = []
    }
    init(){
		switch(this.searchRange){
			case '发起群聊':
			    this.friendList = store.getState().friendList
				break
            case '发起会话':
            case '转发消息':
			    this.friendList = store.getState().friendList
				this.groupList = store.getState().groupList
				break
			case '添加群成员':
			    const { members } = store.getState().groupInfo
				const { friendList } = store.getState()
			    this.friendList = _.filter(friendList,friend=>{
					let exist = false
					_.forEach(members,member=>{
						if(member.uuid==friend.uuid){
							exist = true
						}
					})
					if(exist==false){
						return friend
					}
				})
				break
			case '删除群成员':
			    this.friendList = _.filter(store.getState().groupInfo.members,(item)=>item.uuid!=store.getState().userInfo.uuid)
			    break
			case '分享名片':
			    const { currentConversation } = store.getState()
				if(currentConversation.conversationType=='PRIVATE'){
					this.friendList = _.filter(store.getState().friendList,(firend)=>friend.uuid!=currentConversation.targetId)
				}else{
					this.friendList = store.getState().friendList
				}
                break
			default:
			    return 
		}         
    }
    clearSearchResult(){
        store.dispatch(clearLocalSearchResult([]))
    }
    searchFriend(){
        let remark, item, nickname
        let search = this.pinyin.getFullChars(this.searchContent).toLocaleLowerCase()
        for(let i=0;i<this.friendList.length;i++){
            item = this.friendList[i]
            remark = this.pinyin.getFullChars((item.remark_name ? item.remark_name : '')).toLocaleLowerCase()
            nickname = this.pinyin.getFullChars(item.nickname).toLocaleLowerCase()
            if(remark.indexOf(search)>=0 || nickname.indexOf(search)>=0){
                this.searchResult.push(item)
            }
        }
		if(this.searchRange=='发起会话'){
			this.searchResult = []
		}
        store.dispatch(localSearchResult(this.searchResult))
    }
    searchFriendAndGroup(){
        let remark, item, nickname
        let search = this.pinyin.getFullChars(this.searchContent).toLocaleLowerCase()
        for(let i=0;i<this.friendList.length;i++){
            item = this.friendList[i]
            remark = this.pinyin.getFullChars((item.remark_name ? item.remark_name : '')).toLocaleLowerCase()
            nickname = this.pinyin.getFullChars(item.nickname).toLocaleLowerCase()
            if(remark.indexOf(search)>=0 || nickname.indexOf(search)>=0){
                this.searchResult.push(Object.assign(item,{range:'global'}))
            }
        }
        for(let item of this.groupList){
            nickname = this.pinyin.getFullChars(item.name).toLocaleLowerCase()
            if(nickname.indexOf(search)>=0){
                this.searchResult.push(Object.assign(item,{range:'global'}))
            }
        }
        store.dispatch(localSearchResult(this.searchResult))
    }
}