import { SendFileImgMsg } from '@/rongcloud/sendFileImgMsg'
import $ from 'jquery'
export class Upload{
    constructor(params){
        this.targetId = params.targetId
        this.conversationType = params.conversationType
        this.files = params.files
        this.fileCount = this.files.length
        this.domain = 'http://jhmcimg.weinongtech.com'
        this.observable = null
        this.subscription = null
        this.fileInfo = null
        this.name = null
        this.type = null
        this.size = null
        this.Qiniu = window.Qiniu
    }
    // 判断是文件还是图片
    judeType(file){
        if(file){
            if(file.type.indexOf('image')>=0){
                return '1'
            }else{
                return '2'
            }
        }
    }
    // 限制图片大小
    limitImageSize(urlData, callback){
        let img = new Image()
        img.src = urlData
        let _this = this
        img.onload = function() {
            let that = this
            let w = that.width>300 ? 300 : that.width
            let h = that.height>400 ? 400 : that.height
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            $(canvas).attr({
                width: w,
                height: h
            })
            ctx.drawImage(that, 0, 0, w, h)
            let base64 = canvas.toDataURL('image/jpeg')
            callback(base64)
        }
    }
    // 图片转base64
    imageToBase64(file,callback){
        if(this.judeType(file)==='1'){
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e)=>{
                this.limitImageSize(e.target.result,base64=>{
                    callback(
                        {target:{
                            result:base64
                        }
                    })
                })
            }
        }
        if(this.judeType(file)==='2'){
            callback()
        }
    }
    // base64转png
    base64ToImage(urlData){
        let bytes = window.atob(urlData.split(',')[1])
        let ab = new ArrayBuffer(bytes.length)
        let ia = new Uint8Array(ab)
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i)
        }
        let image = new Blob( [ab] , {type : 'image/jpeg'})
        image.name = '9号米仓_' + new Date().getTime() + '.jpeg'
        console.log(image)
    }
    // 图片压缩
    imageCompress(urlData,scale,callback){
        let img = new Image()
        img.src = urlData
        let _this = this
        img.onload = function() {
            let that = this
            let w = that.width / scale
            let h = that.height / scale
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            $(canvas).attr({
                width: that.width/scale,
                height: that.height/scale
            })
            ctx.drawImage(that, 0, 0, w, h)
            let base64 = canvas.toDataURL('image/jpeg')
            canvas.toBlob(blob=>{
                if(blob.size > 1024*100){
                    _this.imageCompress(base64, 1.2,callback)
                }else{
                    callback(base64)
                }
            }, "image/jpeg")
        }
    }
    // 上传到七牛
    uploadToQiniu (){
        if(this.files==undefined || this.files==null){
            console.log('至少选择一个文件') 
            return
        }
        window.uploadTargetId = this.targetId
        for(let item of this.files){
            this.observable = this.Qiniu.upload(
                item, 
                new Date().getTime() + '/' + item.size + '/' + item.name, 
                sessionStorage.qn_token,
                {
                    fname: item.name,
                    params: {},
                    mimeType:null
                }
            )
            this.subscription = this.observable.subscribe(
                (res)=>{
                    this.uploadPercent(res)
                },
                (res)=>{
                    this.uploadFail(res)
                },
                (res)=>{
                    this.uploadSuccess(res, item)
                }
            )
        }
    }
    // 上传进度
    uploadPercent(res){
        if(res.total.percent!=100){
            console.log('uploading...')
            return
            if(window.uploadTargetId == this.targetId){
                $('.not-file-msg').show()
            }
            $('.not-empty-msg').hide()
            $('.not-file-msg')
                .html(`上传进度&nbsp; ${res.total.percent.toFixed(1)+'%'} <meter value=${res.total.percent} min="0" max="100" style="width:160px;">${res.total.percent}/100</meter>&nbsp;&nbsp;&nbsp;<span class="iconfont icon-guanbi" style="position:relative;top:2px;"></span>`)
            $('.not-file-msg span.iconfont')[0].onclick = ()=>{
                this.subscription.unsubscribe()
                $('.not-file-msg').show().text('已取消上传 !')
                window.uploadTargetId = 0 
                let timer = window.setTimeout(()=>{
                    $('.not-file-msg').hide()
                    clearTimeout(timer)
                },2000)
            }
        }
    }
    // 上传失败
    uploadFail(res){
        console.log(res)
    }
    // 上传成功
    uploadSuccess(res, item){
        this.imageToBase64(item,e=>{
            let params = {
                targetId:this.targetId,
                conversationType:this.conversationType,
                file:{
                    type:item.type,
                    base64:e ? e.target.result : '',
                    url:res.key,
                    name:item.name,
                    size:item.size
                }
            }
            if(item.type.indexOf('image')>=0 && item.size>1024*100){
                this.imageCompress(e.target.result, 1.2, (base64)=>{
                    params.file.base64 = base64
                    new SendFileImgMsg(params)
                    this.base64ToImage(base64)
                })
            }else{
                new SendFileImgMsg(params)
            }
        })
    }
}