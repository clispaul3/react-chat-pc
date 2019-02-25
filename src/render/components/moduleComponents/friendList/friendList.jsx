import React from 'react'
import css_friendList from './friendList.scss'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import store from '@/store/store'
import { getFriendInfo,getGroupInfo,addNewFriendMsg,
    unreadFriendRequest,contextmenuObj,contextmenuEvent } from '@/store/action'
import { Checkbox} from 'element-react'
import { SearchInput } from '@base/searchInput/searchInput'
import { formatTime } from '@/utils/formatTime'
/**
 *  @props
 *  showEl(Array):显示的弹框
    title(String):收起展开标签的标题(friend,group,new-friend)
	friendList(Array):显示的列表
	cancelChoosed(func)，searchResult(func)：父组件传过来的方法
	firstLetter(String):是否显示排序 1:不排序
	searchInput(String):是否支持搜索 1:支持
	checkbox(String):是否支持复选框 1:支持
	checkclose(String):是否支持删除选中 1:支持
 */
export class FriendList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            searchStr:'',
            closeBtnStatus:'none',
            toggleIconDirection:'right',
            currentPage:1
        }
    }
    // 显示用户信息
    showUserInfo(friend,ev){
        if(this.props.checkbox) return
        let event = ev.nativeEvent
        if(event.target.tagName=='INPUT' || event.target.classList.contains('el-checkbox__inner') || event.target.classList.contains('icon-guanbi')){
            return
        }
		if(this.props.title){
			DOMController.controlLeftNavIcon(1)
		}
        if(friend.mobile || Object.keys(friend).indexOf('myApply')>=0){
            if(this.props.showFiendInfo=='0'){
                return
            }
            let uuid = friend.uuid || friend.to_user
            if(Object.keys(friend).indexOf('myApply')>=0){
                if(friend.myApply==1){
                    uuid = friend.to_user
                }else{
                    uuid = friend.go_user
                }
            }
            Friend.getFriendInfo(uuid).then(info=>{
				let showEls = []
				if(friend.range=='global'){
					showEls = [{selector:'#user-info',display:'block'},{selector:'.scroll-search-list',display:'block'}]
					DOMController.showModalBox(showEls)
				}else{
					DOMController.showModalBox(this.props.showEl,event)
                }
                if(Object.keys(friend).indexOf('myApply')>=0){
                    store.dispatch(addNewFriendMsg({
                        reason:friend.reason,
                        from_user:friend.go_user,
                        nickname:friend.nickname,
                        ready_id:friend.ready_id
                    }))
                }
            	store.dispatch(getFriendInfo(info))
            })
        }
        if(friend.icon){
            Ajax.getGroupInfo({id:friend.id},res=>{
				let showEls = []
				if(friend.range=='global'){
					showEls = [{selector:'.group-info-right',display:'block'},{selector:'.scroll-search-list',display:'block'}]
					DOMController.showModalBox(showEls)
				}else{
					DOMController.showModalBox([{selector:'.group-info-right',display:'block'}])
				}
				store.dispatch(getGroupInfo(res))
            })
        }
    }
    closeAllModalBox(){
        DOMController.closeAllModalBox()
    }
    // 选中好友
    selectFriend(friend,ev){
        this.props.searchResult({friend,checked:ev})
        DOMController.showModalBox(_.remove(this.props.showEl,(item)=>item.selector!='#user-info'))
    }
    // 取消选中
    cancelChoosed(friend){
        this.props.cancelChoosed(friend)
        DOMController.showModalBox(_.remove(this.props.showEl,(item)=>item.selector!='#user-info'))
    }
    // 添加好友
    addNewFriend(status,friend,ev){
        ev.stopPropagation()
        if(status=='添加'){
            DOMController.showModalBox([{
                selector:'.box-handle-friend',
                display:'block'
            }])
            store.dispatch(addNewFriendMsg({
                reason:friend.reason,
                from_user:friend.go_user,
                nickname:friend.nickname,
                ready_id:friend.ready_id
            }))
        }
        if(status=='已添加'){
            DOMController.showModalBox([{
                selector:'.resolve-friend-request',
                display:'block'
            }])
        }
        if(status=='已拒绝'){
            DOMController.showModalBox([{
                selector:'.reject-friend-request',
                display:'block'
            }])
        }
        if(status=='等待验证'){
            DOMController.showModalBox([{
                selector:'.waiting-friend-response',
                display:'block'
            }])
        }
    }
    // 显示排序
    showSortResult(item,idx){
        if(this.props.firstLetter=='1'){
            return ''
        }
        if(idx==0 || (idx>0 && this.props.friendList[idx].firstLetter!=this.props.friendList[idx-1].firstLetter)){
            return <p className={'first-letter'}>{item.firstLetter}</p>
        }else{
            return ''
        }
    }
    // 生成单个li
    createSingleLi(friend,idx){
		if(this.props.title && this.state.toggleIconDirection=='right'){
			return
		}
        let liClassName = 'list-style list-style-' + (this.props.title ? this.props.title : '')
        if(idx==0 || (idx>0 && this.props.friendList[idx].firstLetter!=this.props.friendList[idx-1].firstLetter)){
            if(this.props.firstLetter!='1'){
                liClassName += ' special-list-style'
            }
        }
        let liTitle = ''
        if(Object.keys(friend).indexOf('icon')>=0){
            liTitle = friend.name
        }
        if(Object.keys(friend).indexOf('uuid')>=0){
            liTitle = friend.remark_name || friend.nickname
        }
        if(Object.keys(friend).indexOf('myApply')>=0){
            liTitle = friend.nickname
        }
        let key, status,operationtime = ''
        if(this.props.title=='new-friend'){
            key = friend.time + friend.ready_id +friend.go_user
            switch(friend.state){
                case 0:
                    status = friend.myApply==1 ? '等待验证' : '添加'
                    break
                case 1:
                    status = '已添加'
                    break
                case 2:
                    status = '已拒绝'
                    break
                default:
                    break
            }
            operationtime = formatTime(parseInt(String(friend.time) + '000'))
            if(operationtime=='00:00'){
                operationtime = '今天'
            }
        }else{
            key = friend.uuid || friend.id
        }
        return <li key={key} className={liClassName} onClick={this.showUserInfo.bind(this,friend)}
                onContextMenu={this.contextmenu.bind(this,friend)}>
                {this.showSortResult.bind(this,friend,idx)()}
                <p className={'nickname'}>{liTitle}</p>
                {this.props.checkbox=='1' ? <Checkbox onChange={this.selectFriend.bind(this,friend)} checked={friend.checked ? friend.checked : false}></Checkbox> : ''}
                {this.props.checkclose=='1' ? <span className={'iconfont icon-guanbi'} onClick={this.cancelChoosed.bind(this,friend)}></span> : ''}
                <UserPortrait userInfo={friend} size={'default'} showEl={this.props.showEl}></UserPortrait>
                {this.props.title=='new-friend' ? <span className={'add-reason'}>{friend.reason}</span> : ''}
                {this.props.title=='new-friend' ? <span className={'add-status' + (status=='添加' ? ' add-btn' : '')} onClick={this.addNewFriend.bind(this,status,friend)}>{status}</span> : ''}
                {this.props.title=='new-friend' ? <span className={'operation-time'}>{operationtime}</span> : ''}
            </li>
    }
    contextmenu(friend,ev){
        if(this.props.title!='friend' && this.props.title!='group' && this.props.title!='new-friend'){
            return
        }
        ev.preventDefault()
        store.dispatch(contextmenuObj(friend))
		store.dispatch(contextmenuEvent(ev.nativeEvent))
		DOMController.showModalBox([{
			selector:'.handle-menu',display:'block'
		}])  
    }
    // 清空输入框
    clearSearchInput(){
        this.setState({
            searchStr:''
        },()=>{
            this.setState({
                closeBtnStatus:'none'
            })
            this.refs.searchInput.focus()
        })
    }
    // 搜索好友
    searchFriend(ev){
        this.setState({
            searchStr:ev
        },()=>{
            if(ev!=''){
                this.setState({
                    closeBtnStatus:'block'
                })
            }else{
                this.setState({
                    closeBtnStatus:'none'
                })
            }
        })
    }
    // 生成收起展开标签
    toggleList(){
        let  title = ''
        let len = 0
        const { friendList } = this.props
        if(this.props.title=='friend'){
            title = '联系人'
            len = friendList.length
        }
        if(this.props.title=='group'){
            title = '群组'
            len = friendList.length
        }
        if(this.props.title=='new-friend'){
            title = '新朋友'
            _.forEach(friendList,item=>{
                if(item.myApply==0 && item.state==0){
                    len += 1
                }
            })
            if(len>99){
                len = '99+'
            }
            store.dispatch(unreadFriendRequest(len))
        }
        if(title){
            return <p className="toggle" onClick={this.toggleIconDirection.bind(this)} >
                <span className={'iconfont icon-jiantouyou'} ref={'toggleIcon'}></span>
                <span>{title}</span>
                {(len>0 || len == '99+') ? <span className={title=='新朋友' ? 'unadd-count' : ''}>{len}</span> : ''}
            </p>
        }
    }
    // 收起/展开列表
    toggleIconDirection(){
        const { title } = this.props
        if(this.state.toggleIconDirection=='right'){
            this.setState({
                toggleIconDirection:'down'
            })
            this.refs.toggleIcon.style.transform = 'rotate(90deg)'
            this.refs.list.style.display = 'block'
        }else{
            this.setState({
                toggleIconDirection:'right'
            },()=>{
                this.refs.toggleIcon.style.transform = 'rotate(0deg)'
                this.refs.list.style.display = 'none'
            })
        }
		DOMController.controlLeftNavIcon(1)
        DOMController.closeAllModalBox()
    }
    // 拉取好友请求记录
    pullFriendRequest(str){
        const { newFriendList } = store.getState()
        if(str=='pre'){
            if(this.state.currentPage>1){
                this.setState({currentPage:this.state.currentPage-1},()=>{
                    Friend.getNewFriendLsit(this.state.currentPage).then(res=>{})
                })
            }
        }
        if(str=='next'){
            Friend.getNewFriendLsit(this.state.currentPage+1).then(res=>{
                if(res.length>0){
                    this.setState({currentPage:this.state.currentPage+1})
                }
            })
        }
    }
    // 好友请求翻页
    renderHtmlPageTurning(){
        if(store.getState().newFriendList.length>0 || this.state.currentPage!=1){
            return <p className={'page-turning'}>
                <span className={'next iconfont icon-xiayizhang'} onClick={this.pullFriendRequest.bind(this,'next')}></span>
                <span className={'previous iconfont icon-fanhuishangyizhang'} onClick={this.pullFriendRequest.bind(this,'pre')}></span>
                <span className={'current-page'}>{this.state.currentPage}</span>
            </p>
        }else{
            return <p>{''}</p>
        }
    }
    render(){
        return <div id="friend-list">
            {this.props.searchInput=='1' ? <SearchInput></SearchInput> : ''}
            {this.toggleList.bind(this)()}
            <ul ref='list'>
                {this.props.friendList!=undefined ? this.props.friendList.map((item,idx)=>{
                    return this.createSingleLi.bind(this,item,idx)()
                }) : ''}
            </ul>
            {(this.props.title=='new-friend' && this.state.toggleIconDirection=='down') ? this.renderHtmlPageTurning.bind(this)() : ''}
        </div>
    }
}
