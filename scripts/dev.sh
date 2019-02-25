#!/usr/bin/env bash
condition=fasle
# 修改package.json中的入口文件
oldStr='./dist/main/main.js'
newStr='./src/main/main.js'
dev='bash-development'
pro='bash-production'
sed -i "" "s|${oldStr}|${newStr}|" ./package.json
# 修改 src/render/utils/config.js
sed -i "" "s|${pro}|${dev}|" ./src/render/utils/config.js
# 修改 src/main/main.js
sed -i "" "s|${pro}|${dev}|" ./src/main/main.js
# 修改 webpack.render.config.js
sed -i "" "s|${pro}|${dev}|" ./webpack.render.config.js

echo '调试配置修改完成'
# webpack --mode=production --config webpack.render.config.js
# if [ $? -ne 0 ]; then
#     echo "render进程启动失败"
# else
#     condition=true
#     echo "render进程启动完毕"
# fi
# if $condition
# then
#     echo '启动main进程'
#     electron .
# fi
