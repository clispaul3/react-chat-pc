// 查找所有数据
function select_all(callback){
    window.$localDB.transaction(function(tx){
        tx.executeSql('SELECT * FROM VOICEMSG', [], function (ctx, res) {
            callback(res)
        })
    })
}
// 插入数据
function insert_one(params,callback){
    let inserSql = 'INSERT INTO VOICEMSG  VALUES ' + `("${params.msgId}", "${params.senderUserId}","${params.targetId}",
        "${params.isListened}","${params.textContent}")`
    window.$localDB.transaction(function(tx){
        tx.executeSql(inserSql, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            console.log(res)
        })
    })
}
// 查找数据
function select_one(params,callback){
    let selectSql = `SELECT * FROM VOICEMSG WHERE 
    msgId="${params.msgId}"`
    window.$localDB.transaction(function(tx){
        tx.executeSql(selectSql, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            callback(res)
        })
    })
}
// 更新已听/未听状态
function update_isListened(params,callback){
    let updateSql = `UPDATE VOICEMSG SET isListened = "${params.isListened}" WHERE msgId = "${params.msgId}"`
    window.$localDB.transaction(function(tx){
        tx.executeSql(updateSql, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            // console.log(res)
        })
    })
}
// 更新语音的文字内容
function update_textContent(params,callback){
    let updateSql = `UPDATE VOICEMSG SET textContent = "${params.textContent}" WHERE msgId = "${params.msgId}"`
    window.$localDB.transaction(function(tx){
        tx.executeSql(updateSql, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            // console.log(res)
        })
    })
}
export default {
    select_all,
    insert_one,
    select_one,
    update_isListened,
    update_textContent
}