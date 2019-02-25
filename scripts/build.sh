#!/usr/bin/env bash

# 修改package.json中的入口文件
oldStr='./src/main/main.js'
newStr='./dist/main/main.js'
dev='bash-development'
pro='bash-production'
sed -i "" "s|${oldStr}|${newStr}|" ./package.json
# 修改 src/render/utils/config.js
sed -i "" "s|${dev}|${pro}|" ./src/render/utils/config.js
# 修改 src/main/main.js
sed -i "" "s|${dev}|${pro}|" ./src/main/main.js
# 修改 webpack.render.config.js
sed -i "" "s|${dev}|${pro}|" ./webpack.render.config.js

# 拷贝 main 文件夹
if [ ! -d "./dist/main" ]; then
  mkdir ./dist/main
else 
  rm -rf ./dist/main
  mkdir ./dist/main
fi
cp -r ./src/main/* ./dist/main

# 拷贝 html 文件夹
if [ ! -d "./dist/html" ]; then
  mkdir ./dist/html
else 
  rm -rf ./dist/html
  mkdir ./dist/html
fi
cp -r ./src/html/* ./dist/html

# 打包 render 进程
webpack --mode=production --config webpack.render.config.js

# 打包 main 进程
electron-builder
