// 插入一个会话
function insert_one_conversation(params,callback){
    select_one_conversation(params,res=>{
        if(res.rows.length==0){
            let insertSql = 'INSERT INTO CONVERSATION  VALUES ' + 
                `("${params.conId}", "${params.userUuid}", "${params.targetId}", "${params.conversationType}","${params.isTop}","${params.noTips}","${params.lastReadtime}")`
            window.$localDB.transaction(function(tx){
                tx.executeSql(insertSql, [], function (ctx, res) {
                    callback(res)
                },function(ctx,res){
                    callback(res)
                })
            })
        }else{
            callback(res)
        }
    })
}

// 查找一个会话
function select_one_conversation(params,callback){
    let selectSql = `SELECT * FROM CONVERSATION WHERE 
    conId="${params.conId}"`
    window.$localDB.transaction(function(tx){
        tx.executeSql(selectSql, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            callback(res)
        })
    })
}

// 删除一个会话
function delete_one_conversation(params,callback){
    let delete_sql = `DELETE FROM CONVERSATION WHERE 
    conId="${params.conId}"`
    window.$localDB.transaction(function(tx){
        tx.executeSql(delete_sql, [], function (ctx, res) {
            callback(res)
        },function(ctx,res){
            callback(res)
        })
    })
}

// 会话置顶
function set_top(params,callback){
    select_one_conversation(params,res=>{
        if(res.rows.length>0){
            let updateSql = `UPDATE CONVERSATION SET isTop = "${params.isTop}"
                WHERE conId="${params.conId}"`
            window.$localDB.transaction(function(tx){
                tx.executeSql(updateSql, [], function (ctx, _res) {
                    callback(_res)
                },function(ctx,_res){
                    callback(_res)
                })
            })
        }
    })
}

// 消息免打扰
function set_tips(params,callback){
    select_one_conversation(params,res=>{
        if(res.rows.length>0){
            let updateSql = `UPDATE CONVERSATION SET noTips = "${params.noTips}"
                WHERE conId="${params.conId}"`
            window.$localDB.transaction(function(tx){
                tx.executeSql(updateSql, [], function (ctx, _res) {
                    callback(_res)
                },function(ctx,_res){
                    callback(_res)
                })
            })
        }
    })
}
// 最新消息阅读时间
function set_last_readtime(params,callback){
    select_one_conversation(params,res=>{
        if(res.rows.length>0){
            let updateSql = `UPDATE CONVERSATION SET lastReadtime = "${params.lastReadtime}"
                WHERE conId="${params.conId}"`
            window.$localDB.transaction(function(tx){
                tx.executeSql(updateSql, [], function (ctx, _res) {
                    callback(_res)
                },function(ctx,_res){
                    callback(_res)
                })
            })
        }
    })
}
export default {
    insert_one_conversation,
    select_one_conversation,
    set_top,
    set_tips,
    delete_one_conversation,
    set_last_readtime
}