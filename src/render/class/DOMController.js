import md5 from 'blueimp-md5'
import $ from 'jquery'
import { modalBox, zIndex } from '@/public/modalBox'
import store from '@/store/store'
import _ from 'lodash'
export class DOMController{
    static portraitColor(userid){
        var colors = ["#e97ffb", "#00b8d4", "#82b2ff", "#f3db73", "#f0857c"]
		var i = 0
	    if (!userid) {
	        return colors[0]
	    }else{
	    	var str = "wu" + userid + "ye"
	    	var mdstr = md5(str)[0]
	    	mdstr = mdstr ? mdstr : ""
	    	if(mdstr){
                i = mdstr.toUpperCase().charCodeAt() % 5
            }
	    }
	    return colors[i]
	}
	static closeAllModalBox(){
		modalBox.forEach(item=>{
			if(item.display=='block'){
				$(item.el).hide().css({zIndex:0})
			}
			if(item.display=='flex'){
				$(item.el).css({transform:'scale(0)'})
			}
		})
	}
	static showModalBox(el,ev){
		if(el){
			DOMController.closeAllModalBox()
			el.forEach((item,idx)=>{
				if(item==undefined){
					return
				}
				if(item.display=='block'){
					$(item.selector).show().css({zIndex:zIndex[idx]})
					DOMController.locationModalBox(item.selector,ev)
				}
				if(item.display=='flex'){
					$(item.selector).css({
						transform:'scale(1)'
					})
				}
				if(item.selector=='.group-info-right'){
					$(item.selector).css({
						opacity:'1'
					})
				}
			})
		}else{
			DOMController.closeAllModalBox()
		}
	}
	static locationModalBox(el,ev){
		const specialBox = ['.group-info-right','.modal-app-setting','.group-info-',
		    '.scroll-search-list']
		if(specialBox.indexOf(el)>=0){
			$(el).css({background:'#fff'})
			return
		}
		if(el=='.container-share-card'){
			$(el).css({
				left:'315px',
				background:'$fff',
				top:'50%',
				transform:'translateY(-50%)'
			})
			return
		}
		if(el=='.handle-menu'){
			DOMController.locationHandleMenu(el)
			return
		}
		$(el).css({
			left:'50%',
			top:'50%',
			background:'#fff',
			transform:'translate(-50%,-50%)'
		})
	}
	// 控制侧边栏四个小图标的切换
	static controlLeftNavIcon(idx){
		if(idx==0){
			if(store.getState().currentConversation){
				$('.logo-image').hide()
			}
		}
		$('.icon-left-nav').each(function(index,el){
			if(index==idx){
				$(this).addClass('active')
			}else{
				$(this).removeClass('active')
			}
		})
	}
	// 控制右键菜单的显示位置
	static locationHandleMenu(el){
		const { contextmenu } = store.getState()
		let { clientX,clientY } = contextmenu.contextmenuEvent
		const { contextmenuObj } = contextmenu
		const { innerHeight } = window
		if(_.has(contextmenuObj,'conversationType') || _.has(contextmenuObj,'icon') || _.has(contextmenuObj,'uuid')){
			if(innerHeight < 100 + clientY){
				clientY -= 92
			}
		}
		if(_.has(contextmenuObj,'ready_id')){
			if(innerHeight < 40 + clientY){
				clientY -= 32
			}
		}
		$(el).css({
			top:clientY + 'px',
			left:clientX + 'px',
		})
	}
}
