import { THEME } from '../theme.js'

const memberColors = ['#7c4dab', '#a78bc4', '#5ec2a0', '#e0a458']

export function drawDiscordContent(ctx, panel, px, py, width, height) {
  ctx.fillStyle = THEME.textDim
  ctx.font = `11px ${THEME.font}`
  ctx.fillText(panel.channel, px + 18, py + 52)

  ctx.strokeStyle = 'rgba(124, 77, 171, 0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(px + 16, py + 60)
  ctx.lineTo(px + width - 16, py + 60)
  ctx.stroke()

  const visibleMessages = panel.messages.slice(-3)
  let lineY = py + 84

  visibleMessages.forEach((message, index) => {
    const color = memberColors[index % memberColors.length]

    ctx.fillStyle = color
    ctx.font = `bold 12px ${THEME.font}`
    ctx.fillText(message.user, px + 18, lineY)

    ctx.fillStyle = THEME.textDim
    ctx.font = `12px ${THEME.font}`
    ctx.fillText(message.text, px + 18, lineY + 16)

    lineY += 38
  })

  const dotX = px + width - 26
  const dotY = py + height - 20

  ctx.beginPath()
  ctx.arc(dotX, dotY, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#5ec2a0'
  ctx.fill()

  ctx.fillStyle = THEME.textDim
  ctx.font = `11px ${THEME.font}`
  ctx.textAlign = 'right'
  ctx.fillText(`${panel.onlineCount} çevrimiçi`, dotX - 10, dotY + 4)
  ctx.textAlign = 'left'
}