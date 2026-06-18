const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  })

  win.loadFile('index.html')
  win.removeMenu()
}

app.whenReady().then(createWindow)