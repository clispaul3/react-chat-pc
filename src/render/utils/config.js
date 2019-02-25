const development = 'bash-development'.indexOf('dev')>=0 ? 0 : 1
// export const pageIdx = development  // 0:跳过登录页  1:从登录页开始
export const pageIdx = 0 // 从登陆页开始
const appKeyArr = ['dev-qd46yzrfqiomf','pro-kj7swf8ok1rl2']
export const appKey = appKeyArr[development].split('-')[1] //切换正式/测试环境
const build = (appKey=='qd46yzrfqiomf') ? 'http://chattest.weinongtech.com' : 'http://chat.weinongtech.com'
const hostOption = ['/weinong',build] // 切换调试/打包环境
export const $host = hostOption[development]
