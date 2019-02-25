import { initRegisterMsg } from '@/rongcloud/registerMessage'
import store from '@/store/store'
export function initSDK(RongIMLib, params, callbacks, protobuf){
	var appKey = params.appKey
	var token = params.token
	var RongIMClient = RongIMLib.RongIMClient
	var config = {}
	if(protobuf){
		config.protobuf = protobuf
	}
	RongIMClient.init(appKey,null,config);
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
		    switch (status) {
		        case RongIMLib.ConnectionStatus.CONNECTED:
		            break;
		        case RongIMLib.ConnectionStatus.CONNECTING:
		            break;
		        case RongIMLib.ConnectionStatus.DISCONNECTED:
		            break;
		        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
		            break;
		          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
		            break;
				case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
					var callback = {
						onSuccess: function(userId) {
							console.log("Reconnect successfully." + userId)
						},
						onTokenIncorrect: function() {
							console.log('token无效')
						},
						onError:function(errorCode){
							console.log(errorcode)
						}
					}
					var config = {
						auto: true,
						url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
						rate: [100, 1000, 3000, 6000, 10000]
					}
					RongIMClient.reconnect(callback, config)
		        	break
		      }
		}
	});
	RongIMClient.setOnReceiveMessageListener({
		onReceived: function (message) {
			callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
		}
	});
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			callbacks.getCurrentUser && callbacks.getCurrentUser({userId:userId})
			// console.log("链接成功，用户id：" + userId)
			initRegisterMsg()
 		},
		onTokenIncorrect: function() {
			console.log('token无效',token)
		},
		onError:function(errorCode){
			console.log(errorCode)
		}
	})
}
