import { THEME } from './theme.js'
import { drawGrid } from './grid.js'
import { drawSystemWidget } from './widgets/systemWidget.js'
import { initDock } from './widgets/dock.js'
import { drawPanelFrame, getHeaderControlsHit, isInsideResizeHandle } from './panels/panelFrame.js'
import { drawMusicContent, handleMusicClick, tickMusicPanel } from './panels/musicPanel.js'
import { drawFilesContent, handleFilesClick } from './panels/filesPanel.js'
import { drawChatContent, syncChatInput, initChatInput } from './panels/chatPanel.js'
import { drawDiscordContent } from './panels/discordPanel.js'
import { panels } from './panelsData.js'

const canvas = document.getElementById('space')
const ctx = canvas.getContext('2d')
const chatInput = document.getElementById('chatInput')
const dockEl = document.getElementById('dock')

const MIN_PANEL_WIDTH = 220
const MIN_PANEL_HEIGHT = 160
const MAX_PANEL_WIDTH = 640
const MAX_PANEL_HEIGHT = 520

const viewport = { width: 0, height: 0 }

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1
  viewport.width = window.innerWidth
  viewport.height = window.innerHeight

  canvas.width = viewport.width * dpr
  canvas.height = viewport.height * dpr
  canvas.style.width = `${viewport.width}px`
  canvas.style.height = `${viewport.height}px`

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

resizeCanvas()

const stars = []
let offsetX = 0
let offsetY = 0

window.addEventListener('mousemove', (event) => {
  offsetX = (event.clientX - viewport.width / 2) * 0.05
  offsetY = (event.clientY - viewport.height / 2) * 0.05
})

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * viewport.width,
    y: Math.random() * viewport.height,
    size: Math.random() * 2 + 1
  })
}

window.addEventListener('resize', () => {
  resizeCanvas()
})

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

function bringToFront(panel) {
  const index = panels.indexOf(panel)
  if (index !== -1 && index !== panels.length - 1) {
    panels.splice(index, 1)
    panels.push(panel)
  }
}

function setCollapsed(panel, collapsed) {
  gsap.killTweensOf(panel, 'collapseProgress')
  gsap.to(panel, {
    collapseProgress: collapsed ? 1 : 0,
    duration: 0.35,
    ease: collapsed ? 'power2.in' : 'power2.out'
  })
}

function toggleMinimize(panel) {
  panel.minimized = !panel.minimized
  setCollapsed(panel, panel.minimized)
}

function closePanel(panel) {
  if (panel.closing) {
    return
  }

  panel.closing = true
  gsap.killTweensOf(panel, 'collapseProgress')
  gsap.to(panel, {
    collapseProgress: 1,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: () => {
      panel.closed = true
      panel.closing = false
      panel.collapseProgress = 0
    }
  })
}

function openPanel(panel) {
  panel.closed = false
  panel.minimized = false
  panel.alpha = 0
  panel.scale = 0.85
  panel.collapseProgress = 1
  bringToFront(panel)

  gsap.fromTo(panel,
    { alpha: 0, scale: 0.85, collapseProgress: 1 },
    { alpha: 1, scale: 1, collapseProgress: 0, duration: 0.5, ease: 'power2.out' }
  )
}

initDock(dockEl, panels, (panel) => {
  if (panel.closed) {
    openPanel(panel)
    return
  }

  toggleMinimize(panel)
  bringToFront(panel)
})

panels.forEach((panel, index) => {
  panel.alpha = 0
  panel.scale = 0.85
  panel.collapseProgress = 0
  gsap.fromTo(panel,
    { alpha: 0, scale: 0.85 },
    { alpha: 1, scale: 1, duration: 0.6, delay: index * 0.08, ease: 'power2.out' }
  )
})

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

let resizingPanel = null
let resizeMoved = false
let resizeStartWidth = 0
let resizeStartHeight = 0
let resizeStartMouseX = 0
let resizeStartMouseY = 0

function draw() {
  drawGrid(ctx, viewport)

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
    if (panel.type === 'chat') {
      chatInput.style.display = (panel.closed || panel.minimized) ? 'none' : 'block'
    }

    if (panel.closed) {
      return
    }

    const { px, py, drawWidth, drawHeight } = getPanelGeometry(panel)
    const collapseProgress = panel.collapseProgress || 0
    const displayHeight = drawHeight - (drawHeight - 36) * collapseProgress

    ctx.save()
    ctx.globalAlpha = panel.alpha

    drawPanelFrame(ctx, canvas, panel, px, py, drawWidth, displayHeight)

    if (collapseProgress < 1) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(px, py, drawWidth, displayHeight)
      ctx.clip()

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

      if (panel.type === 'discord') {
        drawDiscordContent(ctx, panel, px, py, drawWidth, drawHeight)
      }

      ctx.restore()
    }

    ctx.restore()
  })

  drawSystemWidget(ctx, viewport)

  requestAnimationFrame(draw)
}

canvas.addEventListener('click', (event) => {
  if (dragMoved) {
    dragMoved = false
    return
  }

  if (resizeMoved) {
    resizeMoved = false
    return
  }

  for (let i = panels.length - 1; i >= 0; i--) {
    const panel = panels[i]

    if (panel.closed) {
      continue
    }

    const { px, py, drawWidth, drawHeight } = getPanelGeometry(panel)
    const collapseProgress = panel.collapseProgress || 0
    const displayHeight = drawHeight - (drawHeight - 36) * collapseProgress

    if (!panel.minimized && isInsideResizeHandle(px, py, drawWidth, drawHeight, event.clientX, event.clientY)) {
      return
    }

    const controlHit = getHeaderControlsHit(px, py, drawWidth, event.clientX, event.clientY)

    if (controlHit === 'close') {
      bringToFront(panel)
      closePanel(panel)
      return
    }

    if (controlHit === 'minimize') {
      bringToFront(panel)
      toggleMinimize(panel)
      return
    }

    if (!panel.minimized) {
      if (panel.type === 'music') {
        if (handleMusicClick(panel, px, py, drawWidth, drawHeight, event.clientX, event.clientY)) {
          bringToFront(panel)
          return
        }
      }

      if (panel.type === 'files') {
        if (handleFilesClick(panel, px, py, drawWidth, event.clientX, event.clientY)) {
          bringToFront(panel)
          return
        }
      }
    }

    if (
      event.clientX > px &&
      event.clientX < px + drawWidth &&
      event.clientY > py &&
      event.clientY < py + displayHeight
    ) {
      panel.active = !panel.active
      bringToFront(panel)
      gsap.to(panel, {
        scale: panel.active ? 1.05 : 1,
        duration: 0.3
      })
      return
    }
  }
})

canvas.addEventListener('mousedown', (event) => {
  for (let i = panels.length - 1; i >= 0; i--) {
    const panel = panels[i]

    if (panel.closed) {
      continue
    }

    const { px, py, drawWidth, drawHeight } = getPanelGeometry(panel)

    if (!panel.minimized && isInsideResizeHandle(px, py, drawWidth, drawHeight, event.clientX, event.clientY)) {
      bringToFront(panel)
      resizingPanel = panel
      resizeMoved = false
      resizeStartWidth = panel.width
      resizeStartHeight = panel.height
      resizeStartMouseX = event.clientX
      resizeStartMouseY = event.clientY
      break
    }

    const headerHeight = 36

    const insideHeader =
      event.clientX > px &&
      event.clientX < px + drawWidth &&
      event.clientY > py &&
      event.clientY < py + headerHeight

    if (insideHeader) {
      bringToFront(panel)
      draggedPanel = panel
      dragGrabX = event.clientX - px
      dragGrabY = event.clientY - py
      dragMoved = false
      dragTargetX = panel.x
      dragTargetY = panel.y
      dragVelocityX = 0
      dragVelocityY = 0
      momentumPanel = null
      break
    }
  }
})

window.addEventListener('mousemove', (event) => {
  if (resizingPanel) {
    resizeMoved = true

    const deltaX = event.clientX - resizeStartMouseX
    const deltaY = event.clientY - resizeStartMouseY

    resizingPanel.width = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, resizeStartWidth + deltaX))
    resizingPanel.height = Math.min(MAX_PANEL_HEIGHT, Math.max(MIN_PANEL_HEIGHT, resizeStartHeight + deltaY))
    return
  }

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
  resizingPanel = null
})

draw()