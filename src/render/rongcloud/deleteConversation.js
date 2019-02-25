export function deleteConversation(targetId,conversationType){
    RongIMClient.getInstance().removeConversation(RongIMLib.ConversationType[conversationType],targetId,{
        onSuccess:function(bool){
            console.log('删除会话成功',targetId)
        },
        onError:function(error){
            console.log('删除会话失败',error)
        }
    });
}
