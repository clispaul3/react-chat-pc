## 未实现功能
  * 添加群
  * 图片/文件的复制
  * 文件的粘贴
  * 多张图片的粘贴
  * 断网提示
  * 检查更新
## 关键未实现功能
  * win/mac的兼容
## 待优化的问题
  * 主进程的文件未压缩
  * mac版新消息弹框通知不稳定
## 调试流程
   1. npm run dev:bash
   2. npm run dev
   3. npm run dev:electron
## 打包流程
   npm run build:bash
## 账号切换
   1. 修改 src/index.js
## 正式/测试环境切换
   1. 修改 webpack.render.confong.js
## bash命令
   1. npm run build:bash
   2. npm run dev:bash
   3. npm run commit
## 功能优先级
   1. win版
   2. @消息刷选功能
