import React from 'react'
import { Input } from 'element-react'
import styleSearchInput from './searchInput.scss'
import { DOMController } from '@/class/DOMController'
import { LocalSearch } from '@/public/localSearch'
import store from '@/store/store'
import { searchContent } from '@/store/action'
/**
* @props
* receiveMethod(func): 父组件传过来的方法
* closeAll(String): 是否支持关闭所有弹框
* left(String): 搜索框的定位
* range(String): 搜索范围
*/
export class SearchInput extends React.Component{
    constructor(props){
       super(props)
       this.state = {
           searchStr:'',
           closeBtnStatus:'none'
       }
    }
    clearSearchInput(){
        this.setState({
            searchStr:''
        },()=>{
            this.setState({
                closeBtnStatus:'none'
            })
            this.refs.searchInput.focus()
            new LocalSearch({content:'',searchRange:this.props.range}).clearSearchResult()
            if(this.props.receiveMethod){
                this.props.receiveMethod('')
            }
            store.dispatch(searchContent(''))
        })
    }
    closeAllModalBox(){
        if(this.props.closeAll=='1'){
            DOMController.closeAllModalBox()
        }
    }
    componentDidMount(){
        this.refs.searchDiv.style.left = this.props.left
    }
    search(val){
        this.setState({
            searchStr:val
        },()=>{
            if(val==''){
                this.setState({
                    closeBtnStatus:'none'
                })
                new LocalSearch({content:val,searchRange:this.props.range}).searchFriend()
                if(this.props.receiveMethod){
                    this.props.receiveMethod('')
                }else{
                    store.dispatch(searchContent(val))
                }
            }else{
                if(this.props.receiveMethod){
                    this.props.receiveMethod(val)
                }else{
                    store.dispatch(searchContent(val))
                }
                this.setState({
                    closeBtnStatus:'block'
                })
                if(this.props.range=='发起群聊' || this.props.range=='添加群成员' || this.props.range=='删除群成员' || this.props.range=='分享名片'){
                    new LocalSearch({content:val,searchRange:this.props.range}).searchFriend()
                }
                if(this.props.range=='发起会话' || this.props.range=='转发消息'){
                    new LocalSearch({content:val,searchRange:this.props.range}).searchFriendAndGroup()
                }
            }
        })
    }
    render(){
        return <div id="search-input" ref='searchDiv'>
            <span className={'iconfont icon-shousuo'}></span>
            <span className={'iconfont icon-guanbi1'} onClick={this.clearSearchInput.bind(this)}
                style={{display:this.state.closeBtnStatus}}>
            </span>
            <Input value={this.state.searchStr} onChange={this.search.bind(this)} 
                ref='searchInput' onFocus={this.closeAllModalBox.bind(this)}
                placeholder={this.props.placeholder ? this.props.placeholder : '搜索联系人'}>
            </Input>
        </div>
    }
}
