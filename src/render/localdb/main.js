// 创建本地数据库
export function createLocalDB(){
    window.$localDB = openDatabase('chat','1.0.0','save local message',10*1024*1024*1024)
    window.$localDB.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS MESSAGETABLE (messageUId unique, senderUserId, avatar, nickname, remark_name, is_delete, targetId)')
        tx.executeSql('CREATE TABLE IF NOT EXISTS CONVERSATION (conId unique, userUuid, targetId, conversationType, isTop, noTips, lastReadtime)')
        tx.executeSql('CREATE TABLE IF NOT EXISTS DELETEMSG (msgId unique, senderUserId, targetId)')
        tx.executeSql('CREATE TABLE IF NOT EXISTS VOICEMSG (msgId unique, senderUserId, targetId, isListened, textContent)')
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERINFO (userUuid unique, nickname, avatar, voiceNotice, autoStart, newMsgNotice)')
    })
}
