import { THEME } from '../theme.js'

function getChatLayout(height) {
  return {
    logTop: 50,
    inputY: height - 44,
    inputHeight: 32
  }
}

export function drawChatContent(ctx, panel, px, py, width, height) {
  const layout = getChatLayout(height)
  const visibleMessages = panel.messages.slice(-4)
  const lineHeight = 20
  let lineY = py + layout.logTop

  visibleMessages.forEach(message => {
    const isUser = message.sender === 'user'
    ctx.fillStyle = isUser ? THEME.text : THEME.textDim
    ctx.font = `12px ${THEME.font}`
    ctx.textAlign = 'left'
    const prefix = isUser ? '> ' : '· '
    ctx.fillText(prefix + message.text, px + 16, lineY)
    lineY += lineHeight
  })

  const barX = px + 14
  const barY = py + layout.inputY
  const barWidth = width - 28
  const barHeight = layout.inputHeight

  ctx.fillStyle = 'rgba(124, 77, 171, 0.06)'
  ctx.beginPath()
  ctx.roundRect(barX, barY, barWidth, barHeight, 8)
  ctx.fill()

  ctx.strokeStyle = panel.inputFocused ? THEME.primary : 'rgba(124, 77, 171, 0.3)'
  ctx.lineWidth = 1
  ctx.stroke()
}

export function syncChatInput(inputEl, px, py, width, height) {
  const layout = getChatLayout(height)
  const barX = px + 14
  const barY = py + layout.inputY
  const barWidth = width - 28
  const barHeight = layout.inputHeight

  inputEl.style.left = `${barX + 10}px`
  inputEl.style.top = `${barY + (barHeight - 16) / 2}px`
  inputEl.style.width = `${barWidth - 20}px`
}

export function initChatInput(inputEl, panel) {
  inputEl.style.color = THEME.text
  inputEl.style.caretColor = THEME.primary
  inputEl.style.fontFamily = THEME.font
  document.documentElement.style.setProperty('--chat-dim', THEME.textDim)

  inputEl.addEventListener('focus', () => {
    panel.inputFocused = true
  })

  inputEl.addEventListener('blur', () => {
    panel.inputFocused = false
  })

  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && inputEl.value.trim() !== '') {
      panel.messages.push({ sender: 'user', text: inputEl.value.trim() })
      inputEl.value = ''

      setTimeout(() => {
        panel.messages.push({ sender: 'assistant', text: 'Anlaşıldı.' })
      }, 600)
    }

    if (event.key === 'Escape') {
      inputEl.blur()
      event.stopPropagation()
    }
  })
}