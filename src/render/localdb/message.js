// 查找所有数据
function select_all_msg(callback){
    window.$localDB.transaction(function(tx){
        tx.executeSql('SELECT * FROM MESSAGETABLE', [], function (ctx, res) {
            callback(res)
        })
    })
}
// 插入数据
function insert_msg(params,callback){
    let inserSql = 'INSERT INTO MESSAGETABLE  VALUES ' + `("${params.messageUId}", "${params.senderUserId}", "${params.avatar}", "${params.nickname}", "${params.remark_name}", "${params.is_delete}","${params.targetId}")`
    window.$localDB.transaction(function(tx){
        tx.executeSql(inserSql, [], function (ctx, res) {
            callback(res)
        })
    })
}
// 删除某条消息
function delete_one_msg(params,callback){
    let messageUId = params.messageUId
    let updateSQL = `UPDATE MESSAGETABLE SET is_delete="true" where messageUid="${messageUId}"`
    window.$localDB.transaction(function(tx){
        tx.executeSql(updateSQL, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            callback(res)
        })
    })
}
// 查找某条数据(查找群友头像)
function select_one_msg(params,callback){
    let { messageUId } = params
    window.$localDB.transaction(function(tx){
        tx.executeSql(`SELECT * FROM MESSAGETABLE WHERE messageUId="${messageUId}"`, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            console.log(res)
        })
    })
}

export default {
    select_all_msg,
    insert_msg,
    delete_one_msg,
    select_one_msg
}
