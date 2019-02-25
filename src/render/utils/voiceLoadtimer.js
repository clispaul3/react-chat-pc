export function startTimerInterval(){
    if(window.$voiceLoadingTimer){
        return
    }
    let reg = 0
    window.$voiceLoadingTimer = window.setInterval(()=>{
        $('.text-content .icon-dengdai').css({transform:`translate(-50%) rotate(${reg}deg)`})
            reg += 10
        },
    100)
}
export function closeTimerInterval(){
    if(window.$voiceLoadingTimer){
        clearInterval(window.$voiceLoadingTimer)
        window.$voiceLoadingTimer = null
    }
}