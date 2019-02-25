import $ from 'jquery'
import md5 from 'blueimp-md5'
import { appKey } from '@/utils/config'
import { sendGifMessage } from './sendGifMsg'
function http_build_query(params){
    var queryArr = [];
    for(var key in params){
        queryArr.push(key + '=' + encodeURIComponent(params[key]));
    }
    var query = queryArr.join('&')
    return query;
}
function sign(params , key){
    var signArr = [];
    for(var key in params){
        signArr.push(key + '=' + params[key]);
    }
    var signStr = signArr.join('&') +'&key='+key;
    const signRes = md5(signStr).toUpperCase();
    return signRes;
}
function getBQMMAppInfo(codes, access_token, app_id, app_secret,callback){
    var date = new Date();
    var timestamp = date.getTime();
    var params = { };
    params['access_token'] = access_token;
    params['app_name'] = '9号米仓';
    params['os'] = 'Android8.1.0';
    params['provider'] = 'sdk';
    params['sdk_version'] = '2.1.0';
    params['package_name'] = 'com.wnkj.jhmc.app'; // app 的包名
    params['device_no'] = 'a70f9045-224a-444f-959b-1a81eb901c8b';
    params['region'] = 'null';
    params['app_id'] = app_id;
    params['timestamp'] = timestamp;
    params['signature'] = sign(params, app_secret);
    var api = 'https://api.dongtu.com:1443/api/v1/emoji/codes?' + http_build_query(params);
    var codesArr = codes.split(',');
    var data = {"codes":[]};
    data['codes'] = codesArr;
    $.ajax({
        'url':api,
        'type':'post',
        'dataType': 'json',
        'contentType':'application/json',
        'data':JSON.stringify(data),
        success:function(resp){
            // console.log(resp)
            getStickerList(resp.data_list[0].package_id,params)
            callback(resp)
        },
        error:function(){
            console.log('获取失败')
        }
    })
}
export function getStickerList(package_id,params){
    var api = 'https://api.dongtu.com:1443/api/v1/package/'+package_id+'?' + http_build_query(params);
    $.ajax({
        'url':api,
        'type':'get',
        'dataType': 'json',
        success:function(resp){
            // console.log(resp)
            // let list = resp.data.emoticions
            // let html = ''
            // html = `<img src=${resp.data.chat_icon} width="30" height="30">`
            // // for(let item of list){
            // //     console.log(item)
            // //     html += `<img src=${item.main_image} width="30" height="30">`
            // // }
            // $('.box-gif-list').html(html)
        },
        error:function(){
            console.log('获取失败')
        }
    })
}
export function getEmojiStickerUrl(codes,callback){
    const platform_id = '464878039ce8441a8a0a9f88d8efed4b'
    var access_token,app_id,app_secret
    if(sessionStorage.getItem('access_token')){
        access_token = sessionStorage.getItem('access_token')
        app_id = sessionStorage.getItem('app_id')
        app_secret = sessionStorage.getItem('app_secret')
        getBQMMAppInfo(codes, access_token, app_id, app_secret,res=>{
            callback(res)
        });
    }else{
        $.get('https://api.dongtu.com:1443/api/v1/token/platform?n_key='+appKey+'&platform_id='+platform_id, function(resp){
            if(resp.error_code == 0){
                var data = resp['data'];
                var access_token = data['access_token'];
                sessionStorage.setItem('access_token',access_token)
                var app_id = data['app_id'];
                sessionStorage.setItem('app_id',app_id)
                var app_secret = data['app_secret'];
                sessionStorage.setItem('app_secret',app_secret)
                var expires_in = data['expires_in']; // 有效期 7200
                let timer = window.setTimeout(()=>{
                    sessionStorage.setItem('access_token','')
                    sessionStorage.setItem('app_id','')
                    sessionStorage.setItem('app_secret','')
                },7000)
                getBQMMAppInfo(codes, access_token, app_id, app_secret,res=>{
                    callback(res)
                });
            }
        }, 'json')
    }
    
}
				