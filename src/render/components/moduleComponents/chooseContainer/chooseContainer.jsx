import React from 'react'
import style_chooseContainer from './chooseContainer.scss'
import { connect } from 'react-redux'
import _ from 'lodash'
import { FriendList } from '@module/friendList/friendList'
import { Scrollbars } from 'react-custom-scrollbars'
import { SearchInput } from '@base/searchInput/searchInput'
import store from '@/store/store'
import { addGroup } from '@/store/action'
import { Group } from '@/class/Group'
import { RegisterMessage } from '@/rongcloud/registerMessage'
import { MsgContextmenu } from '@base/handleMenu/messageContextmenu'
/**
 *  适用场景：发起群聊 | 添加群成员 | 删除群成员 | 转发消息 | 分享名片
 *  @props
      containerTitle:(String) 标题
	  containerClass:(String) 类名
	  searchRange:(Array) 搜索范围(friend | friend+group | group-members)
 */
export class ChooseContainer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           searchContent:'',
           choosedFriend:[],
		   showEl:[]
       }
    }
	// 计算显示弹框
	showModals(str){
		let showEl = [{selector:'#user-info',display:'block'}]
		const { containerTitle } = this.props
		if(containerTitle=='添加群成员' ){
			showEl.push({selector:'.group-info-',display:'block'})
			showEl.push({selector:'.container-add-friend',display:'block'})
		}
		if(containerTitle=='删除群成员'){
			showEl.push({selector:'.group-info-',display:'block'})
			showEl.push({selector:'.container-delete-friend',display:'block'})
		}
		if(containerTitle=='发起群聊'){
			showEl.push({selector:'.container-create-group',display:'block'})
		}
		if(containerTitle=='分享名片'){
			showEl.push({selector:'.container-share-card',display:'block'})
        }
        if(containerTitle=='转发消息'){
            showEl.shift()
            showEl.push({selector:'.container-transmit-message',display:'block'})
        }
		if(str=='scroll'){
			DOMController.showModalBox(_.filter(showEl,(item)=>item.selector!='#user-info'))
		}
		if(str=='group-info-'){
			DOMController.showModalBox([{selector:'.group-info-',display:'block'}])
		}
		return showEl
	}
	// 确定提示弹框
	confirmNoticeModal(){
		const { containerTitle } = this.props
		switch(containerTitle){
			case '发起群聊':
			    return <div className={"modal-create-group"}>
			    	<p className={"p-title"}>
			    		<span className={'notice'}>提示</span>
			    		<span className={"close iconfont icon-guanbi"} onClick={this.cancel.bind(this,'last-two')}></span>
			    	</p>
			    	<input type="text" placeholder="请设置群名称" className={'add-remark-input'} ref={'groupName'}/>
			    	<p className={"not-empty"} ref={'notEmpty'}>群名称不能为空</p>
			    	<button className={'btn-success'} onClick={this.createGroup.bind(this)}>确定</button>
			    </div>
			default:
			    return
		}
	}
    // 关闭
    cancel(str){
        if(str == 'close-all'){
            DOMController.closeAllModalBox()
            this.setState({choosedFriend:[]})
        }
        if(str=='last-one'){
			DOMController.showModalBox(_.filter(this.showModals(),(item)=>{
				if(item.selector!='#user-info' && item.selector.indexOf('.container')==-1){
					return item
				}
			}))
			this.setState({choosedFriend:[]})
		}
		if(str=='last-two'){
			DOMController.showModalBox(_.filter(this.showModals(),(item)=>{
				if(item.selector!='.modal-create-group-fail' && item.selector!='#user-info'){
					return item
				}
			}))
		}
    }
    // 接收子组件SearchInput传过来的值
    receiveValFromSearchInput(val){
        this.setState({
            searchContent:val
        })
    }
    // 取消选中
    cancelChoosed(friend){
        let arr = this.state.choosedFriend
        this.setState({choosedFriend:_.filter(arr,item=>{
            if(item.avatar && item.uuid!=friend.uuid){
                return item
            }
            if(item.icon && item.id != friend.id){
                return item
            }
        })})
    }
    // 添加选中
    searchResult(params){
        const { friend,checked } = params
        let arr = this.state.choosedFriend
        if(checked){
            this.setState({choosedFriend:_.concat(arr,friend)})
        }else{
            this.cancelChoosed(friend)
        }
    }
    // 搜索结果列表
    searchList(){
        if(this.state.searchContent!='' && this.props.createGroup.length==0){
            return <p style={{textAlign:'center',color:'#ccc'}}>暂无搜索结果</p>
        }
        return <FriendList friendList={this.markFriend.bind(this)()} checkbox={'1'}  
            searchResult={this.searchResult.bind(this)} 
            showEl={this.showModals.bind(this,'check')()}>
        </FriendList>
    }
    // 标记好友状态(选中或非选中)
    markFriend(){
        let arr = []
        let choosedArr = this.state.choosedFriend
        let targetArr = []
        if(this.props.createGroup.length>0){
            targetArr = this.props.createGroup
        }
        if(this.state.searchContent==''){
            targetArr = this.props.searchRange
        }
        for(let item of targetArr){
            const res = _.find(choosedArr,o => {
                if(o.avatar && o.uuid == item.uuid){
                    return o
                }
                if(o.icon && o.id == item.id){
                    return o
                }
            })
            if(res){
                arr.push(Object.assign(item,{checked:true}))
            }else{
                arr.push(Object.assign(item,{checked:false}))
            }
        }
        return arr
    }
    // 确定-->执行的操作
    confirm(){
        const { containerTitle } = this.props
		if(this.state.choosedFriend.length==0){
			let showEls = this.showModals()
			showEls.splice(0,1,{selector:'.modal-create-group-fail',display:'block'})
			DOMController.showModalBox(showEls)
		}else{
			let id = ''
			let friends = []
			if(store.getState().groupInfo){
				id = store.getState().groupInfo.group_info.id
				_.forEach(this.state.choosedFriend,(item)=>{
					friends.push(item.uuid)
				})
			}
			switch(containerTitle){
				case '发起群聊':
				    DOMController.showModalBox([{selector:'.modal-create-group',display:'block'},{selector:'.container-create-group',display:'block'}])
					break
				case '添加群成员':
				    Group.joinGroup({id,friends:friends.join(',')},res=>{
						if(res.status=='1'){
							this.cancel('close-all')
						}
					})
					break
				case '删除群成员':
				    Group.quitGroup({id,friends:friends.join(',')},res=>{
						if(res.status=='1'){
							this.cancel('close-all')
						}
				    })
                    break
                case '分享名片':
                    const { currentConversation,userInfo } = store.getState()
                    this.state.choosedFriend.forEach((item)=>{
                        const params = {
                            targetId:currentConversation.targetId,
                            conversationType:currentConversation.conversationType,
                            name:item.nickname,
                            userId:item.uuid,
                            portraitUri:item.avatar,
                            sendUserName:userInfo.nickname,
                            sendUerId:userInfo.uuid
                        }
                        RegisterMessage.shareCard(params)
                    })
                    this.cancel('close-all')
                    break
                case '转发消息':
                    this.cancel('close-all')
                    MsgContextmenu.transmitMsg(this.state.choosedFriend)
                    break
				default:
				    return
			}
		}
    }
    // 创建群组
    createGroup(){
        if(this.refs.groupName.value==''){
            this.refs.notEmpty.style.display = 'block'
            let timer = window.setTimeout(()=>{
                this.refs.notEmpty.style.display = 'none'
                clearTimeout(timer)
            },3000)
        }else{
            DOMController.closeAllModalBox()
            let friends = []
            _.forEach(this.state.choosedFriend,(item)=>{
                friends.push(item.uuid)
            })
            friends = _.uniq(friends)
            let params = {
                name:this.refs.groupName.value,
                friends:friends.join(',')
            }
            this.cancel('#choose-container')
            Group.createGroup(params,res=>{
                this.refs.groupName.value = ''
				this.cancel('close-all')
            })
        }
    }
    render(){
        return <div id="choose-container" className={this.props.containerClass}>
            <p className={'p-title'}>
                <span className={'notice'}>{this.props.containerTitle}</span>
                <span className={'iconfont icon-guanbi'} onClick={this.cancel.bind(this,'last-one')}></span>
            </p>
			{this.confirmNoticeModal.bind(this)()}
            <div className={"modal-create-group-fail"}>
                <p className={"p-title"}>
                    <span className={'notice'}>提示</span>
                    <span className={"close iconfont icon-guanbi"} onClick={this.cancel.bind(this,'last-two')}></span>
                </p>
                <p>至少选择一个联系人</p>
                <button className={'btn-success'} onClick={this.cancel.bind(this,'last-two')}>确定</button>
            </div>
            <SearchInput range={this.props.containerTitle} receiveMethod={this.receiveValFromSearchInput.bind(this)}></SearchInput>
            <Scrollbars style={{ width:242, height:372}}  autoHide autoHideDuration={200}
                onScroll={this.showModals.bind(this,'scroll')} className={'scroll-container'}>
                {this.searchList.bind(this)()}
            </Scrollbars>
            <p style={{position:'absolute',top:'48px',left:'310px'}}>{this.state.choosedFriend.length==0 ? '选择要添加的联系人' : '已选中 ' + this.state.choosedFriend.length + ' 个联系人'}</p>
            <Scrollbars style={{ width:242, height:280,position:'absolute',right:0,top:83}}  autoHide autoHideDuration={200}
                onScroll={this.showModals.bind(this,'scroll')} className={'choosed-friend scroll-container'}>
                <FriendList friendList={this.state.choosedFriend} cancelChoosed={this.cancelChoosed.bind(this)}
                    showEl={this.showModals.bind(this,'check')()}
                    firstLetter={'1'} checkclose={'1'}>
                </FriendList>
            </Scrollbars>
            <button className={'btn-success'} onClick={this.confirm.bind(this)}>确定</button>
            <button className={'btn-default'} onClick={this.cancel.bind(this,'last-one')}>取消</button>
        </div>
    }
}
const mapState = (state)=>{return {userInfo:state.userInfo,createGroup:state.createGroup}}
export default connect (mapState)(ChooseContainer)