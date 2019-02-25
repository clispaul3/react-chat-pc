const { app } = require('electron')
function existOnlyoneApp(mainWindow){
    const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
        if (mainWindow) {
            mainWindow.show()
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
    if (shouldQuit) {
        mainWindow.destroy()
        app.quit()
    }
}
module.exports = {
    existOnlyoneApp
}