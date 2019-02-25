import { appKey } from '@/utils/config'
export function getStickerMsgUrl(params,callback){
    const config = { appkey:appKey }
    const rongSticker = RongSticker.init(config)
    var Package = rongSticker.Package
    const Sticker = rongSticker.Sticker
    Sticker.get(params,(result, error)=>{
        callback(result)
    })
}
