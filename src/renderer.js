import { THEME } from './theme.js'
import { drawGrid } from './grid.js'
import { drawSystemWidget } from './widgets/systemWidget.js'
import { drawPanelFrame } from './panels/panelFrame.js'
import { drawMusicContent, handleMusicClick, tickMusicPanel } from './panels/musicPanel.js'
import { drawFilesContent, handleFilesClick } from './panels/filesPanel.js'
import { drawChatContent, syncChatInput, initChatInput } from './panels/chatPanel.js'
import { panels } from './panelsData.js'

const canvas = document.getElementById('space')
const ctx = canvas.getContext('2d')
const chatInput = document.getElementById('chatInput')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const stars = []
let offsetX = 0
let offsetY = 0

window.addEventListener('mousemove', (event) => {
  offsetX = (event.clientX - canvas.width / 2) * 0.05
  offsetY = (event.clientY - canvas.height / 2) * 0.05
})

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1
  })
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.activeElement !== chatInput) {
    window.close()
  }
})

setInterval(() => {
  const musicPanel = panels.find(panel => panel.type === 'music')
  if (musicPanel) {
    tickMusicPanel(musicPanel)
  }
}, 1000)

const chatPanel = panels.find(panel => panel.type === 'chat')
if (chatPanel) {
  initChatInput(chatInput, chatPanel)
}

function getPanelGeometry(panel) {
  const drawWidth = panel.width * panel.scale
  const drawHeight = panel.height * panel.scale
  const px = panel.x + offsetX * 0.3 - (drawWidth - panel.width) / 2
  const py = panel.y + offsetY * 0.3 - (drawHeight - panel.height) / 2
  return { px, py, drawWidth, drawHeight }
}

let draggedPanel = null
let dragGrabX = 0
let dragGrabY = 0
let dragMoved = false
let dragTargetX = 0
let dragTargetY = 0
let dragVelocityX = 0
let dragVelocityY = 0
let momentumPanel = null

function draw() {
  drawGrid(ctx, canvas)

  if (draggedPanel) {
    const previousX = draggedPanel.x
    const previousY = draggedPanel.y

    draggedPanel.x += (dragTargetX - draggedPanel.x) * 0.25
    draggedPanel.y += (dragTargetY - draggedPanel.y) * 0.25

    dragVelocityX = draggedPanel.x - previousX
    dragVelocityY = draggedPanel.y - previousY
  }

  if (momentumPanel) {
    momentumPanel.x += dragVelocityX
    momentumPanel.y += dragVelocityY

    dragVelocityX *= 0.9
    dragVelocityY *= 0.9

    if (Math.abs(dragVelocityX) < 0.05 && Math.abs(dragVelocityY) < 0.05) {
      momentumPanel = null
    }
  }

  stars.forEach(star => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
    ctx.fillRect(star.x + offsetX * 0.1, star.y + offsetY * 0.1, star.size, star.size)
  })

  panels.forEach(panel => {
    const { px, py, drawWidth, drawHeight } = getPanelGeometry(panel)

    drawPanelFrame(ctx, panel, px, py, drawWidth, drawHeight)

    if (panel.type === 'music') {
      drawMusicContent(ctx, panel, px, py, drawWidth, drawHeight)
    }

    if (panel.type === 'files') {
      drawFilesContent(ctx, panel, px, py, drawWidth, drawHeight)
    }

    if (panel.type === 'chat') {
      drawChatContent(ctx, panel, px, py, drawWidth, drawHeight)
      syncChatInput(chatInput, px, py, drawWidth, drawHeight)
    }
  })

  drawSystemWidget(ctx, canvas)

  requestAnimationFrame(draw)
}

canvas.addEventListener('click', (event) => {
  if (dragMoved) {
    dragMoved = false
    return
  }

  panels.forEach(panel => {
    const { px, py, drawWidth, drawHeight } = getPanelGeometry(panel)

    if (panel.type === 'music') {
      const handled = handleMusicClick(panel, px, py, drawWidth, drawHeight, event.clientX, event.clientY)
      if (handled) {
        return
      }
    }

    if (panel.type === 'files') {
      const handled = handleFilesClick(panel, px, py, drawWidth, event.clientX, event.clientY)
      if (handled) {
        return
      }
    }

    if (
      event.clientX > px &&
      event.clientX < px + drawWidth &&
      event.clientY > py &&
      event.clientY < py + drawHeight
    ) {
      panel.active = !panel.active
      gsap.to(panel, {
        scale: panel.active ? 1.05 : 1,
        duration: 0.3
      })
    }
  })
})

canvas.addEventListener('mousedown', (event) => {
  panels.forEach(panel => {
    const { px, py, drawWidth } = getPanelGeometry(panel)
    const headerHeight = 36

    const insideHeader =
      event.clientX > px &&
      event.clientX < px + drawWidth &&
      event.clientY > py &&
      event.clientY < py + headerHeight

    if (insideHeader) {
      draggedPanel = panel
      dragGrabX = event.clientX - px
      dragGrabY = event.clientY - py
      dragMoved = false
      dragTargetX = panel.x
      dragTargetY = panel.y
      dragVelocityX = 0
      dragVelocityY = 0
      momentumPanel = null
    }
  })
})

window.addEventListener('mousemove', (event) => {
  if (!draggedPanel) {
    return
  }

  dragMoved = true

  const desiredPx = event.clientX - dragGrabX
  const desiredPy = event.clientY - dragGrabY

  dragTargetX = desiredPx - offsetX * 0.3
  dragTargetY = desiredPy - offsetY * 0.3
})

window.addEventListener('mouseup', () => {
  if (draggedPanel) {
    momentumPanel = draggedPanel
  }

  draggedPanel = null
})

draw()