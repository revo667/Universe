import { THEME } from '../theme.js'
import { formatTime } from '../utils/format.js'

export function getMusicControlPositions(px, py, width, height) {
  const centerX = px + width / 2
  const buttonY = py + height - 38

  return {
    prev: { x: centerX - 42, y: buttonY, r: 14 },
    play: { x: centerX, y: buttonY, r: 18 },
    next: { x: centerX + 42, y: buttonY, r: 14 }
  }
}

function drawIconPlay(ctx, x, y) {
  ctx.beginPath()
  ctx.moveTo(x - 4, y - 6)
  ctx.lineTo(x - 4, y + 6)
  ctx.lineTo(x + 6, y)
  ctx.closePath()
  ctx.fill()
}

function drawIconPause(ctx, x, y) {
  ctx.fillRect(x - 5, y - 6, 3, 12)
  ctx.fillRect(x + 2, y - 6, 3, 12)
}

function drawIconPrev(ctx, x, y) {
  ctx.beginPath()
  ctx.moveTo(x + 4, y - 6)
  ctx.lineTo(x + 4, y + 6)
  ctx.lineTo(x - 4, y)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(x - 6, y - 6, 2, 12)
}

function drawIconNext(ctx, x, y) {
  ctx.beginPath()
  ctx.moveTo(x - 4, y - 6)
  ctx.lineTo(x - 4, y + 6)
  ctx.lineTo(x + 4, y)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(x + 4, y - 6, 2, 12)
}

export function drawMusicContent(ctx, panel, px, py, width, height) {
  const track = panel.track
  const contentY = py + 62

  ctx.fillStyle = THEME.text
  ctx.font = `bold 16px ${THEME.font}`
  ctx.fillText(track.title, px + 18, contentY)

  ctx.fillStyle = THEME.textDim
  ctx.font = `13px ${THEME.font}`
  ctx.fillText(track.artist, px + 18, contentY + 20)

  const barX = px + 18
  const barY = py + height - 76
  const barWidth = width - 36
  const progress = track.elapsed / track.duration

  ctx.fillStyle = 'rgba(124, 77, 171, 0.2)'
  ctx.fillRect(barX, barY, barWidth, 4)

  ctx.fillStyle = THEME.primary
  ctx.fillRect(barX, barY, barWidth * progress, 4)

  ctx.fillStyle = THEME.textDim
  ctx.font = `11px ${THEME.font}`
  ctx.textAlign = 'left'
  ctx.fillText(formatTime(track.elapsed), barX, barY + 18)
  ctx.textAlign = 'right'
  ctx.fillText(formatTime(track.duration), barX + barWidth, barY + 18)
  ctx.textAlign = 'left'

  const controls = getMusicControlPositions(px, py, width, height)

  ctx.strokeStyle = 'rgba(124, 77, 171, 0.35)'
  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.arc(controls.prev.x, controls.prev.y, controls.prev.r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(controls.next.x, controls.next.y, controls.next.r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = THEME.primary
  ctx.beginPath()
  ctx.arc(controls.play.x, controls.play.y, controls.play.r, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = THEME.text
  drawIconPrev(ctx, controls.prev.x, controls.prev.y)
  drawIconNext(ctx, controls.next.x, controls.next.y)

  ctx.fillStyle = THEME.background
  if (track.playing) {
    drawIconPause(ctx, controls.play.x, controls.play.y)
  } else {
    drawIconPlay(ctx, controls.play.x, controls.play.y)
  }
}

export function handleMusicClick(panel, px, py, width, height, mouseX, mouseY) {
  const controls = getMusicControlPositions(px, py, width, height)
  const hit = Object.entries(controls).find(([key, btn]) => {
    const dx = mouseX - btn.x
    const dy = mouseY - btn.y
    return Math.sqrt(dx * dx + dy * dy) <= btn.r
  })

  if (!hit) {
    return false
  }

  const [key] = hit
  if (key === 'play') {
    panel.track.playing = !panel.track.playing
  } else {
    panel.track.elapsed = 0
  }

  return true
}

export function tickMusicPanel(panel) {
  if (!panel.track.playing) {
    return
  }

  panel.track.elapsed += 1
  if (panel.track.elapsed >= panel.track.duration) {
    panel.track.elapsed = 0
  }
}