import { THEME } from '../theme.js'

function getFilesLayout(py) {
  return { startY: py + 66, rowHeight: 30 }
}

function drawIconFolder(ctx, x, y) {
  ctx.beginPath()
  ctx.moveTo(x, y - 5)
  ctx.lineTo(x + 5, y - 5)
  ctx.lineTo(x + 7, y - 3)
  ctx.lineTo(x + 16, y - 3)
  ctx.lineTo(x + 16, y + 6)
  ctx.lineTo(x, y + 6)
  ctx.closePath()
  ctx.fill()
}

function drawIconFile(ctx, x, y) {
  ctx.beginPath()
  ctx.moveTo(x, y - 7)
  ctx.lineTo(x + 9, y - 7)
  ctx.lineTo(x + 13, y - 3)
  ctx.lineTo(x + 13, y + 7)
  ctx.lineTo(x, y + 7)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(x + 9, y - 7)
  ctx.lineTo(x + 9, y - 3)
  ctx.lineTo(x + 13, y - 3)
  ctx.closePath()
  ctx.fillStyle = THEME.background
  ctx.fill()
}

export function drawFilesContent(ctx, panel, px, py, width, height) {
  const { startY, rowHeight } = getFilesLayout(py)

  ctx.fillStyle = THEME.textDim
  ctx.font = `11px ${THEME.font}`
  ctx.fillText('/ Home', px + 18, py + 50)

  panel.files.forEach((item, index) => {
    const rowY = startY + index * rowHeight

    if (panel.selectedIndex === index) {
      ctx.fillStyle = THEME.headerFill
      ctx.fillRect(px + 10, rowY - rowHeight / 2, width - 20, rowHeight)
    }

    if (item.kind === 'folder') {
      ctx.fillStyle = THEME.primary
      drawIconFolder(ctx, px + 18, rowY)
    } else {
      ctx.fillStyle = THEME.textDim
      drawIconFile(ctx, px + 20, rowY)
    }

    ctx.fillStyle = THEME.text
    ctx.font = `13px ${THEME.font}`
    ctx.fillText(item.name, px + 44, rowY + 4)

    if (item.size) {
      ctx.fillStyle = THEME.textDim
      ctx.font = `11px ${THEME.font}`
      ctx.textAlign = 'right'
      ctx.fillText(item.size, px + width - 18, rowY + 4)
      ctx.textAlign = 'left'
    }
  })
}

export function handleFilesClick(panel, px, py, width, mouseX, mouseY) {
  const { startY, rowHeight } = getFilesLayout(py)

  for (let i = 0; i < panel.files.length; i++) {
    const rowY = startY + i * rowHeight
    const top = rowY - rowHeight / 2
    const bottom = rowY + rowHeight / 2

    if (mouseX >= px && mouseX <= px + width && mouseY >= top && mouseY <= bottom) {
      panel.selectedIndex = panel.selectedIndex === i ? null : i
      return true
    }
  }

  return false
}