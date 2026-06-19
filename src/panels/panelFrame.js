import { THEME } from '../theme.js'

export function drawPanelFrame(ctx, panel, px, py, width, height) {
  const radius = 14

  ctx.shadowColor = THEME.primaryGlow
  ctx.shadowBlur = 8
  ctx.fillStyle = THEME.panelFill
  ctx.beginPath()
  ctx.roundRect(px, py, width, height, radius)
  ctx.fill()

  ctx.strokeStyle = panel.active ? THEME.primary : 'rgba(124, 77, 171, 0.25)'
  ctx.lineWidth = 1.2
  ctx.stroke()

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(px, py, width, 36, [radius, radius, 0, 0])
  ctx.clip()
  ctx.fillStyle = THEME.headerFill
  ctx.fillRect(px, py, width, 36)
  ctx.restore()

  ctx.fillStyle = THEME.text
  ctx.font = `bold 14px ${THEME.font}`
  ctx.fillText(panel.title, px + 18, py + 23)

  ctx.beginPath()
  ctx.arc(px + width - 16, py + 18, 4, 0, Math.PI * 2)
  ctx.fillStyle = panel.active ? THEME.primary : 'rgba(167, 139, 196, 0.3)'
  ctx.fill()
}