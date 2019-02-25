// 查找所有数据
function select_all_msg(callback){
    window.$localDB.transaction(function(tx){
        tx.executeSql('SELECT * FROM DELETEMSG', [], function (ctx, res) {
            callback(res)
        })
    })
}
// 插入数据
function insert_one_msg(params,callback){
    let inserSql = 'INSERT INTO DELETEMSG  VALUES ' + `("${params.msgId}", "${params.senderUserId}","${params.targetId}")`
    window.$localDB.transaction(function(tx){
        tx.executeSql(inserSql, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            console.log(res)
        })
    })
}
// 查找数据
function select_one_msg(params,callback){
    let selectSql = `SELECT * FROM DELETEMSG WHERE 
    msgId="${params.msgId}"`
    window.$localDB.transaction(function(tx){
        tx.executeSql(selectSql, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            callback(res)
        })
    })
}
export default {
    select_all_msg,
    insert_one_msg,
    select_one_msg
}