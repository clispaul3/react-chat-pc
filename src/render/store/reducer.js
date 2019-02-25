import { combineReducers } from 'redux'
import TYPE from './constant'
import _ from 'lodash'
import { SortMail } from '@/public/sortMail'

const initStore = {
    userInfo:null,
    friendInfo:null,
    friendList:[],
    groupList:[],
    groupInfo:null,
    createGroup:[],
	conversationList:[]
}
export function userInfo(state = initStore.userInfo, action){
    switch(action.type){
        case TYPE.GET_USER_INFO:
			return action.userInfo
		case TYPE.UPDATE_USER_SIGNATURE:
			return Object.assign(state,{signature:action.signature})
		case TYPE.UPDATE_USER_NICKNAME:
			return Object.assign(state,{nickname:action.nickname})
		default:
            return state
    }
}
export function friendInfo(state = initStore.friendInfo, action){
    switch(action.type){
        case TYPE.GET_FRIEND_INFO:
            return action.friendInfo
        default:
            return state
    }
}
export function friendList(state = initStore.friendList, action){
    switch(action.type){
        case TYPE.FRIEND_LIST:
            return action.friendList
		case TYPE.ADD_FRIEND:
            return new SortMail({list:_.concat(state,action.friend)}).getSortMail()
        case TYPE.DELETE_FRIEND:
            return _.filter(state,item=>item.uuid!=action.uuid)
		case TYPE.UPDATE_FRIEND_INFO:
		    return _.map(state,(friend)=>{
				if(friend.uuid==action.uuid){
					const { friendInfo } = action
					friend = Object.assign(friend,{nickname:friendInfo.remark_name || friendInfo.nickname,avatar:friendInfo.avatar})
				}
    		    return friend
		    })
        default:
            return state
    }
}
export function groupInfo(state = initStore.groupInfo, action){
    switch(action.type){
        case TYPE.GET_GROUP_INFO:
            return action.groupInfo
        default:
            return state
    }
}
export function groupNotice(state = null,action){
	  switch(action.type){
		case TYPE.GET_GROUP_NOTICE:
			return action.groupNotice
		default:
			return state
		}
}
export function groupList(state = initStore.groupList, action){
    let arr = state
    switch(action.type){
        case TYPE.GROUP_LIST:
            return action.groupList
        case TYPE.ADD_GROUP:
			return new SortMail({list:_.concat(arr,action.groupInfo)}).getSortMail()
        case TYPE.DELETE_GROUP:
            return _.filter(arr,(item)=>item.id!=action.id)
		case TYPE.UPDATE_GROUP_INFO:
			return _.map(state,(group)=>{
				if(group.id==action.id){
						group = Object.assign(group,{name:action.groupInfo.name,icon:action.groupInfo.icon})
				}
				return group
			})
        default:
            return state
    }
}
export function createGroup(state = [], action){
    switch(action.type){
        case TYPE.LOCAL_SEARCH_RESULT:
            return action.searchResultOfCreateGroup
        case TYPE.CLEAR_LOCAL_SEARCH_RESULT:
            return action.clearFriendOfCreateGroup
        default:
            return state
    }
}
export function searchContent(state = '',action){
    switch(action.type){
        case TYPE.SEARCH_CONTENT:
            return action.content
        default:
            return state
    }
}
export function conversationList(state = [],action){
    switch(action.type){
        case TYPE.CONVERSATION_LIST:
            return action.conversationList
		case TYPE.ADD_ONE_CONVERSATION:
			return [...state,action.conversation]
		case TYPE.DELETE_ONE_CONVERSATION:
			return _.filter(state,item => item.targetId!=action.targetId)
		case TYPE.UPDATE_CONVERSATION_SENTTIME:
			return _.map(state,(con)=>{
				if(con.targetId==action.targetId){
					con = Object.assign(con,{sentTime:action.sentTime})
				}
				return con
			})
		case TYPE.UPDATE_CONVERSATION_LATESTMSG:
			return _.map(state,(con)=>{
				if(con.targetId==action.targetId){
					con = Object.assign(con,{latestMsg:action.content})
				}
				return con
			})
		case TYPE.UPDATE_CONVERSATION_SENDERNAME:
			return _.map(state,(con)=>{
				if(con.targetId==action.targetId){
					con = Object.assign(con,{senderName:action.senderName})
				}
				return con
			})
		case TYPE.UPDATE_CONVERSATION_ICON:
			return _.map(state,(con)=>{
				if(con.targetId==action.targetId){
					con = Object.assign(con,{avatar:action.icon})
				}
				return con
			})
		case TYPE.UPDATE_CONVERSATION_NICKNAME:
			return _.map(state,(con)=>{
				if(con.targetId==action.targetId){
					con = Object.assign(con,{nickname:action.nickname})
				}
				return con
			})
		case TYPE.UPDATE_CONVERSATION_UNREADCOUNT:
			return _.map(state,(con)=>{
				if(con.targetId==action.targetId){
					con = Object.assign(con,{unreadCount:action.count})
				}
				return con
			})
		case TYPE.UPDATE_CONVERSATION_ISTOP:
		    return _.map(state,(con)=>{
				if(con.targetId==action.targetId){
					con = Object.assign(con,{isTop:action.isTop})
				}
				return con
			})
		case TYPE.UPDATE_CONVERSATION_NOTIPS:
		    return _.map(state,(con)=>{
				if(con.targetId==action.targetId){
					con = Object.assign(con,{noTips:action.noTips})
				}
				return con
			})
		
        default :
            return state
    }
}
export function totalUnreadCount(state = 0,action){
	  switch(action.type){
			  case TYPE.GET_TOTAL_UNREAD_COUNT:
				    return action.count
				default:
				    return state
		}
}
export function currentConversation(state = null,action){
	switch(action.type){
		case TYPE.TOGGLE_CURRENT_CONVERSATION:
			return action.currentConversation
		case TYPE.UPDATE_CONVERSATION_LAST_READTIME:
		    return Object.assign(state,{lastReadtime:action.time})
		default:
			return state
		}
}
export function conMessageList(state = [],action){
	switch(action.type){
      case TYPE.CLEAR_CON_MESSAGE_LIST:
        return []
	  case TYPE.ADD_ONE_MESSAGE:
		return _.concat(state,action.message)
      case TYPE.SHIFT_ONE_MESSAGE:
		return _.concat(action.message,state)
	  case TYPE.DELETE_ONE_MESSAGE:
		return _.filter(state, msg => msg.messageUId != action.messageUId)
	  case TYPE.TOGGLE_CHECKBOX_STATUS:
	    return _.map(state,item=>{
			if(item.messageUId==action.messageUId && item.sentTime==action.sentTime){
				item = Object.assign(item,{checked:action.checked})
			}
			return item
		})
	  case TYPE.CLEAR_CHECKBOX_STATUS:
	    return _.map(state,item=>{
			return Object.assign(item,{checked:false})
		})
	  case TYPE.UPDATE_MESSAGE_READ_STATUS:
	    return _.map(state,item=>{
			if(parseInt(item.sentTime) > parseInt(action.time)){
				item = Object.assign({},item,{readStatus:0})
			}else{
				item = Object.assign({},item,{readStatus:1})
			}
			return item
		})
	  case TYPE.UPDATE_TEXT_CONTENT:
	    return _.map(state,item=>{
			if(item.messageUId==action.messageUId){
				item = Object.assign({},item,{textContent:action.textContent})
			}
			return item
		})
	  case TYPE.UPDATE_LISTENED_STATUS:
		return _.map(state,item=>{
			if(item.messageUId==action.messageUId){
				item = Object.assign({},item,{isListened:'1'})
			}
			return item
		})
	  case TYPE.TOGGLE_TEXT_CONTEN_DISPLAY:
		return _.map(state,item=>{
			if(item.messageUId==action.messageUId){
				item = Object.assign({},item,{showTextContent:action.display})
			}
			return item
		})
      default:
        return state
	}
}
export function newFriendList(state = [],action){
	switch(action.type){
		case TYPE.GET_NEW_FRIEND_LIST:
		case TYPE.ADD_NEW_FRIEND_LIST:
			return action.list
		case TYPE.DELETE_ONE_FRIEND_REQUEST:
		    return _.filter(state,item => item.ready_id != action.ready_id)
		default:
		    return state
	}
}
export function addNewFriendMsg(state = null, action){
	switch(action.type){
		case TYPE.ADD_NEW_FRIEND_MSG:
			return action.obj
		default:
		    return state
	}
}
export function unreadFriendRequest(state = 0, action){
	switch(action.type){
		case TYPE.UNREAD_FRIEND_REQUEST:
			return action.count
		default:
		    return state
	}
}
export function contextmenu(state = null, action){
	switch(action.type){
		case TYPE.CONTEXT_MENU_OBJ:
			return Object.assign({},state,{contextmenuObj:action.obj})
		case TYPE.CONTEXT_MENU_EVENT:
			return Object.assign({},state,{contextmenuEvent:action.event}) 
		default:
		    return state
	}
}
export function multipleStatus(state = 0, action){
	switch(action.type){
		case TYPE.TOGGLE_MULTIPLE_STATUS:
			return action.status
		default:
		    return state
	}
}
export const appReducers = combineReducers({
  friendInfo,
  friendList,
  groupList,
  userInfo,
  groupInfo,
  groupNotice,
  createGroup,
  searchContent,
  conversationList,
  totalUnreadCount,
  currentConversation,
  conMessageList,
  newFriendList,
  addNewFriendMsg,
  unreadFriendRequest,
  contextmenu,
  multipleStatus
})
