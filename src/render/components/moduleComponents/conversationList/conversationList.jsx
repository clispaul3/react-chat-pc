import React from 'react'
import { connect } from 'react-redux'
import style_conversationList from './conversation.scss'
import { Conversation } from './conversation'
import _ from 'lodash'
import store from '@/store/store'
import { getTotalUnreadCount,updateConversationIstop, updateConversationNotips} from '@/store/action'
import conversation_db from '@/localdb/conversation'
import lastMsgReadstatus_db from '@/localdb/lastreadmsg'

export class ConversationList extends React.Component{
    constructor(props){
		super(props)
		this.state = {
			hasInsertCon:[]
		}
	}
	componentWillReceiveProps(){
		const { userInfo } = store.getState()
		_.forEach(this.props.conversationList,con=>{
			if(typeof this.state.hasInsertCon == 'number'){
				return
			}
			if(this.state.hasInsertCon.indexOf(con.targetId)<=0){
				this.setState({hasInsertCon:this.state.hasInsertCon.push(con.targetId)},()=>{
					conversation_db.insert_one_conversation({
						conId:userInfo.uuid + '~~~' + con.targetId,
						userUuid:userInfo.uuid,
						targetId:con.targetId,
						conversationType:con.conversationType,
						isTop:con.isTop ? con.isTop : '0',
						noTips:con.noTips ? con.noTips : '0',
						lastReadtime:new Date().getTime()
					},res=>{
						if(res.rows){
							if(res.rows.length>0){
								store.dispatch(updateConversationIstop(res.rows[0].targetId,res.rows[0].isTop))
								store.dispatch(updateConversationNotips(res.rows[0].targetId,res.rows[0].noTips))
							}
						}
					})
				})
			}
		})
	}
	sortConversationList(){
		let totalUnreadCount = 0
		this.props.conversationList.forEach(con=>{
			if(con.unreadCount && con.noTips!='1'){
				totalUnreadCount += con.unreadCount
			}
		})
		store.dispatch(getTotalUnreadCount(totalUnreadCount))
		// 	排序会话列表
		let sortList = this.props.conversationList.sort((conA,conB)=>{
			return parseInt(conB.sentTime)-parseInt(conA.sentTime)
		})
		// 不排序
		// let sortList = this.props.conversationList
		let isTopCon = []
		let noTopCon = []
		_.forEach(sortList,con=>{
			if(con.isTop=='1'){
				isTopCon.push(con)
			}else{
				noTopCon.push(con)
			}
		})
		sortList = _.concat(isTopCon,noTopCon)
		if(sortList){
			return _.uniqBy(sortList,'targetId').map(con=>{
				return <Conversation key={con.targetId} conversation={con}></Conversation>
			})
		}
	}
    render(){
        return <div id="conversation-list">
            {this.sortConversationList.bind(this)()}
        </div>
    }
}
const mapState = (state)=>{return {conversationList:state.conversationList}}
export default connect (mapState)(ConversationList)
