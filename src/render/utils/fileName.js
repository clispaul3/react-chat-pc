/**
 * @param
 * str:处理的字符串
 * type:'card' | 'file' | 'add-reason',
 */
export function fileName(type,str){
    switch(type){
        case 'file':
            if(str.length>20){
                let startstr = str.substr(0,10)
                let endstr = str.substr(-10,10)
                return startstr + '...' + endstr
            }else{
                return str
            }
            break
        case 'card':
            if(str.length>5){
                let startstr = str.substr(0,2)
                let endstr = str.substr(-3,3)
                return startstr + '...' + endstr
            }else{
                return str
            }
            break
        case 'add-reason':
            if(str.length>50){
                let startstr = str.substr(0,30)
                let endstr = str.substr(-20,20)
                return startstr + '...' + endstr
            }else{
                return str
            }
        case 'mobile':
            let startstr = str.substr(0,3)
            let endstr = str.substr(-3,3)
            return startstr + '****' + endstr
        default:
            break
    }
}