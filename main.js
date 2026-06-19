const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true
  })

  win.loadFile('index.html')
  win.removeMenu()
}

const { globalShortcut } = require('electron')

app.whenReady().then(() => {
  globalShortcut.register('Escape', () => {
    app.quit()
  })
  createWindow()
})