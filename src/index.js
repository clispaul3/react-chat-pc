import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Ajax } from '@/public/ajax'
import { DOMController } from '@/class/DOMController'
import { Friend } from '@/class/Friend'
import emojiObj from '@/rongcloud/emojiInit'
import store from '@/store/store.js'
import Index from '@/pages/index'
import { Login } from '@/pages/login'
import axios from 'axios'
import $ from 'jquery'
import '@/utils/getQiniuToken'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createLocalDB } from '@/localdb/main'
import { pageIdx } from '@/utils/config'
createLocalDB()
window.Ajax = Ajax
window.DOMController = DOMController
window.Friend = Friend
window.emojiObj = emojiObj
window.axios = axios
window.$ = $
window.$urlDefaultImg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545721090380&di=c1131fea9b4342aa81003aec9703b821&imgtype=0&src=http%3A%2F%2Fimg0.ph.126.net%2F-XGmt5SPEK3rQJBsIJgOVQ%3D%3D%2F191121509204050360.jpg'
window.$mentionedFriends = []
const App = document.querySelector('#app')
const testUserArr = [{mobile:'13400000004',password:'111111'},
    {mobile:'13400000006',password:'111111'},{mobile:'13533088900',password:'123456'}]
const user = Object.assign(testUserArr[1],{login_type:'mobile'})
const RenderPage = (idx)=>{
    if(idx==0){
        Ajax.login(user,res=>{
            ReactDOM.render(
                <Provider store={store}>
                    <Index></Index>
                </Provider>
            ,App)
        })
    }
    if(idx==1){
        ReactDOM.render(
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route path='/home' component={Index} />
                        <Route path='/' component={Login} />
                    </Switch>
                </Router>
            </Provider>
        ,App)
    }
}
RenderPage(pageIdx)



