import _ from 'lodash'
// 查找所有数据
function select_all(callback){
    window.$localDB.transaction(function(tx){
        tx.executeSql('SELECT * FROM USERINFO', [], function (ctx, res) {
            callback(res)
        })
    })
}
// 更新一条数据
function update_one(params,callback){
    select_one(params,res=>{
        if(res.rows.length>0){
            let updateSql = `UPDATE USERINFO SET nickname = "${params.nickname}", avatar = "${params.avatar}", voiceNotice = "${params.voiceNotice}",autoStart = "${params.autoStart}",newMsgNotice = "${params.newMsgNotice}"
                WHERE userUuid = "${params.userUuid}"`
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
// 
// 插入数据
function insert_one(params,callback){
    let inserSql = 'INSERT INTO USERINFO  VALUES ' + `("${params.userUuid}", "${params.nickname}", "${params.avatar}", "${params.voiceNotice}", "${params.autoStart}", "${params.newMsgNotice}")`
    window.$localDB.transaction(function(tx){
        tx.executeSql(inserSql, [], function (ctx, user) {
            callback(user)
        })
    })
}
// 查找一条数据
function select_one(params,callback){
    let { userUuid} = params
    window.$localDB.transaction(function(tx){
        tx.executeSql(`SELECT * FROM USERINFO WHERE userUuid="${userUuid}"`, [], function (ctx, res) {
            if(res.rows.length>0){
                callback(res)
            }else{
                insert_one({
                    userUuid,nickname:params.nickname,avatar:params.avatar,voiceNotice:'1',autoStart:'1',newMsgNotice:'1'
                },doc=>{
                    callback('insert')
                })
            }
        },function(ctx,res){
            console.log(res)
        })
    })
}
export default {
    select_all,
    insert_one,
    select_one,
    update_one
}

