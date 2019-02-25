import store from '@/store/store'
export function CountDown(){
    const { userInfo } = store.getState()
    let isIndentity = userInfo.identy_validated
    if(isIndentity=='2'){
        window.$countdown = []
        return
    }
    let createTime = new Date(userInfo.create_time).getTime()
    let deatTime = createTime + 10*24*60*60*1000
    if(isIndentity!='2' && deatTime<new Date().getTime()){
        window.$overtime = 1
        window.$countdown = []
        return
    }
    if(deatTime < new Date().getTime()){
        window.$countdown = []
        return
    }
    window.$countdown = []
    window.$countdown2 = window.setInterval(function(){
        let countDown = deatTime - new Date().getTime()
        if(countDown < 0){
            window.$countdown = []
            clearInterval(window.$countdown2)
            return
        }
        let days = Math.floor(countDown/(24*60*60*1000))
        let lasthour = countDown%(24*60*60*1000)
        let hours = Math.floor(lasthour/(60*60*1000))
        let lastminute = lasthour%(60*60*1000)
        let minutes = Math.floor(lastminute/(60*1000))
        let lastSeconds = lastminute%(60*1000)
        let seconds = Math.floor(lastSeconds/1000)
        window.$countdown = [days,hours,minutes,seconds]
    },1000)
}