const { ipcMain } = require('electron')
const { platform } = require('os')
const { createTray } = require('../mac/createTray')
const { createMenu } = require('../mac/createMenu')
const { videowin } = require('./videowin')
const { imagewin } = require('./imagewin')
function listenIpcMain(mainwindow){
    ipcMain.on('route',(ev,route)=>{
        mainwindow.setSize(route)
        if(platform()=='darwin'){
            createTray()
            createMenu(route)
        }
    })
    ipcMain.on('video-url',(ev,sighturl)=>{
        videowin(sighturl)
    })
    ipcMain.on('image-list',(ev,list,idx)=>{
        imagewin(list,idx)
    })
    ipcMain.on('set-size',(ev,{w,h})=>{
        if(platform()=='darwin'){
            global.$imagewindow.setSize(w,h,true)
        }
        if(platform()=='win32'){
            global.$imagewindow.setSize(w,h)
        }
    })
    ipcMain.on('close-image-window',()=>{
        global.$imagewindow.close()
        global.$imagewindow = null
    })
}
module.exports = {
    listenIpcMain
}