import { THEME } from '../theme.js'

export function drawSystemWidget(ctx, canvas) {
  const width = 220
  const height = 70
  const margin = 20
  const x = canvas.width - width - margin
  const y = margin
  const radius = 14

  ctx.shadowColor = THEME.primaryGlow
  ctx.shadowBlur = 8
  ctx.fillStyle = THEME.panelFill
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
  ctx.fill()

  ctx.strokeStyle = 'rgba(124, 77, 171, 0.25)'
  ctx.lineWidth = 1.2
  ctx.stroke()

  const now = new Date()
  const time = now.toLocaleTimeString('en-GB')
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' })

  ctx.fillStyle = THEME.primary
  ctx.font = `bold 22px ${THEME.font}`
  ctx.fillText(time, x + 18, y + 35)

  ctx.fillStyle = THEME.textDim
  ctx.font = `13px ${THEME.font}`
  ctx.fillText(date, x + 18, y + 55)
}