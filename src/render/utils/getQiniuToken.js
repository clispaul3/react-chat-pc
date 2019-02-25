const qiniu = window.require('qiniu')
const Qiniu = require('qiniu-js')
function getQiniuToken(){
    const AK = 'Jhzn_5JsLIduz7OFPXxOInemgkn8J4S5NohKs443'
    const SK = 'pu3JS3JWcPrg-lN07iBKIc6S9Etv4QxRttE2rxSP'
    const mac = new qiniu.auth.digest.Mac(AK, SK)
    const options = {
        scope: 'jhmc',
        detectMime: 1
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)
    sessionStorage.setItem('qn_token',uploadToken)
    window.Qiniu = Qiniu
}
getQiniuToken()
window.setInterval(()=>{
    getQiniuToken()
},1000*60*60)
