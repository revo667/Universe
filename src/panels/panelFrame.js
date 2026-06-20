import { THEME } from '../theme.js'

function drawGlassLayer(ctx, canvas, px, py, width, height, radius) {
  const dpr = window.devicePixelRatio || 1
  const blurAmount = 18
  const pad = blurAmount * 2

  const sx = Math.max(0, (px - pad) * dpr)
  const sy = Math.max(0, (py - pad) * dpr)
  const sw = Math.max(0, Math.min(canvas.width - sx, (width + pad * 2) * dpr))
  const sh = Math.max(0, Math.min(canvas.height - sy, (height + pad * 2) * dpr))

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(px, py, width, height, radius)
  ctx.clip()

  ctx.filter = `blur(${blurAmount}px)`
  ctx.drawImage(canvas, sx, sy, sw, sh, px - pad, py - pad, width + pad * 2, height + pad * 2)
  ctx.filter = 'none'

  ctx.restore()
}

function drawTopHighlight(ctx, px, py, width, height, radius) {
  const gradient = ctx.createLinearGradient(px, py, px, py + height)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.10)')
  gradient.addColorStop(0.18, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(px, py, width, height, radius)
  ctx.fill()
}

function drawCollapseFlash(ctx, panel, px, py, width, height, headerHeight) {
  const progress = panel.collapseProgress || 0
  const flash = Math.sin(Math.min(Math.max(progress, 0), 1) * Math.PI)

  if (flash < 0.02) {
    return
  }

  const lineY = py + headerHeight + (height - headerHeight) / 2

  ctx.save()
  ctx.globalAlpha = flash
  ctx.strokeStyle = THEME.primary
  ctx.shadowColor = THEME.primaryGlow
  ctx.shadowBlur = 24 * flash
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(px + 8, lineY)
  ctx.lineTo(px + width - 8, lineY)
  ctx.stroke()
  ctx.restore()
}

export function getHeaderControlPositions(px, py, width) {
  const y = py + 18
  return {
    close: { x: px + width - 16, y, r: 8 },
    minimize: { x: px + width - 40, y, r: 8 }
  }
}

export function getHeaderControlsHit(px, py, width, mouseX, mouseY) {
  const controls = getHeaderControlPositions(px, py, width)

  const hit = Object.entries(controls).find(([key, btn]) => {
    const dx = mouseX - btn.x
    const dy = mouseY - btn.y
    return Math.sqrt(dx * dx + dy * dy) <= btn.r
  })

  return hit ? hit[0] : null
}

function drawHeaderControls(ctx, px, py, width) {
  const controls = getHeaderControlPositions(px, py, width)

  ctx.strokeStyle = THEME.textDim
  ctx.lineWidth = 1.4

  ctx.beginPath()
  ctx.moveTo(controls.close.x - 4, controls.close.y - 4)
  ctx.lineTo(controls.close.x + 4, controls.close.y + 4)
  ctx.moveTo(controls.close.x + 4, controls.close.y - 4)
  ctx.lineTo(controls.close.x - 4, controls.close.y + 4)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(controls.minimize.x - 4, controls.minimize.y)
  ctx.lineTo(controls.minimize.x + 4, controls.minimize.y)
  ctx.stroke()
}

export function isInsideResizeHandle(px, py, width, height, mouseX, mouseY) {
  const x = px + width
  const y = py + height
  const size = 18

  return mouseX >= x - size && mouseX <= x && mouseY >= y - size && mouseY <= y
}

function drawResizeHandle(ctx, px, py, width, height) {
  const x = px + width
  const y = py + height

  ctx.strokeStyle = 'rgba(167, 139, 196, 0.45)'
  ctx.lineWidth = 1.4

  for (let i = 1; i <= 3; i++) {
    const offset = i * 5
    ctx.beginPath()
    ctx.moveTo(x - offset, y - 2)
    ctx.lineTo(x - 2, y - offset)
    ctx.stroke()
  }
}

export function drawPanelFrame(ctx, canvas, panel, px, py, width, height) {
  const radius = 14

  drawGlassLayer(ctx, canvas, px, py, width, height, radius)

  ctx.fillStyle = THEME.panelFill
  ctx.beginPath()
  ctx.roundRect(px, py, width, height, radius)
  ctx.fill()

  drawTopHighlight(ctx, px, py, width, height, radius)

  const flash = Math.sin(Math.min(Math.max(panel.collapseProgress || 0, 0), 1) * Math.PI)

  ctx.shadowColor = THEME.primaryGlow
  ctx.shadowBlur = (panel.active ? 14 : 8) + flash * 20
  ctx.strokeStyle = panel.active ? THEME.primary : 'rgba(124, 77, 171, 0.25)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.roundRect(px, py, width, height, radius)
  ctx.stroke()
  ctx.shadowBlur = 0

  const headerHeight = Math.min(36, height)
  const headerCorners = height <= 36 ? [radius, radius, radius, radius] : [radius, radius, 0, 0]

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(px, py, width, headerHeight, headerCorners)
  ctx.clip()
  ctx.fillStyle = THEME.headerFill
  ctx.fillRect(px, py, width, headerHeight)
  ctx.restore()

  drawCollapseFlash(ctx, panel, px, py, width, height, headerHeight)

  ctx.fillStyle = THEME.text
  ctx.font = `bold 14px ${THEME.font}`
  ctx.fillText(panel.title, px + 18, py + 23)

  const dotPulse = panel.active ? Math.sin(Date.now() / 300) * 2 + 5 : 4

  ctx.beginPath()
  ctx.arc(px + width - 64, py + 18, dotPulse, 0, Math.PI * 2)
  ctx.fillStyle = panel.active ? THEME.primary : 'rgba(167, 139, 196, 0.3)'
  ctx.shadowColor = THEME.primaryGlow
  ctx.shadowBlur = panel.active ? 10 : 0
  ctx.fill()
  ctx.shadowBlur = 0

  drawHeaderControls(ctx, px, py, width)

  if ((panel.collapseProgress || 0) < 0.01) {
    drawResizeHandle(ctx, px, py, width, height)
  }
}