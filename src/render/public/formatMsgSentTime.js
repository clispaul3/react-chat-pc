export function formatMsgSentTime(timestamp){
    var timeShowPlace = ''
    /** 消息发送时间 **/
    var timestamp = parseInt(timestamp)
    var msgTime = new Date(timestamp);
    var msgTimeYear = msgTime.getUTCFullYear()
    var msgTimeMonth = (msgTime.getUTCMonth()+1)
    var msgTimeDate = msgTime.getUTCDate()
    var hms = "";
    hms += " " + msgTime.getHours() + ":"
    hms += " " + msgTime.getMinutes() >= 10 ? msgTime.getMinutes():'0'+msgTime.getMinutes()
    if(0<= msgTime.getHours() && msgTime.getHours() <5){
        hms = ' 凌晨' + hms
    }
    if(5<= msgTime.getHours() && msgTime.getHours() <12){
        hms = ' 上午' + hms
    }
    if(12<= msgTime.getHours() && msgTime.getHours() <13){
        hms = ' 中午' + hms
    }
    if(13<= msgTime.getHours()　&& msgTime.getHours() <18){
        hms = ' 下午' + hms
    }
    if(18<= msgTime.getHours() && msgTime.getHours() <24){
        hms = ' 晚上' + hms
    }
    /** 获取本地时间 **/
    var myDate = new Date();
    var myDateYear = myDate.getUTCFullYear()
    var myDateMonth = myDate.getUTCMonth()+1
    var myDateDate = myDate.getUTCDate()
    var dateMinus = msgTimeDate - myDateDate
    /** 消息发送时间和本地时间为同一天 **/
    if (msgTimeYear == myDateYear && msgTimeMonth == myDateMonth && msgTimeDate == myDateDate) {
        return hms
    }
    /** 消息发送时间在一周范围内 **/
    else if (msgTimeYear == myDateYear && msgTimeMonth == myDateMonth && dateMinus >= -6 && dateMinus <= -1){
        for (var i = 0 ; i <= 6 ; i++){
            if( myDate.getDay() == i) {
                if (dateMinus == -6) {
                    return '星期'
                        + (i==0?'一':(i==1?'二':(i==2?'三':(i==3?'四':(i==4?'五':(i==5?'六':(i==6?'日':' ')))))))
                        + ' ' + (timeShowPlace=="messageList"?'':hms)
                } else if (dateMinus == -5) {
                    return '星期'
                        +(i==0?'二':(i==1?'三':(i==2?'四':(i==3?'五':(i==4?'六':(i==5?'日':(i==6?'日':' ')))))))
                        + ' ' + (timeShowPlace=="messageList"?'':hms)
                } else if (dateMinus == -4) {
                    return '星期'
                        +(i==0?'三':(i==1?'四':(i==2?'五':(i==3?'六':(i==4?'日':(i==5?'一':(i==6?'二':' ')))))))
                        + ' ' + (timeShowPlace=="messageList"?'':hms)
                } else if (dateMinus == -3) {
                    return '星期'
                        +(i==0?'四':(i==1?'五':(i==2?'六':(i==3?'日':(i==4?'一':(i==5?'二':(i==6?'三':' ')))))))
                        + ' ' + (timeShowPlace=="messageList"?'':hms)
                } else if (dateMinus == -2) {
                    return '星期'
                        +(i==0?'五':(i==1?'六':(i==2?'日':(i==3?'一':(i==4?'二':(i==5?'三':(i==6?'四':' ')))))))
                        + ' ' + (timeShowPlace=="messageList"?'':hms)
                } else {
                    return '昨天' + hms
                }
            }
        }
    }
    /** 消息发送时间在一周范围外 **/
    else {
        return msgTimeYear+'/'+msgTimeMonth+'/'+msgTimeDate + hms
    }
}
