const canvas = document.getElementById('space')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const stars = []
let offsetX = 0
let offsetY = 0

const panels = [
  { x: 100, y: 100, width: 300, height: 200, title: 'Spotify', active: false, scale: 1 },
  { x: 500, y: 150, width: 300, height: 200, title: 'Discord', active: false, scale: 1 },
  { x: 300, y: 400, width: 300, height: 200, title: 'Files', active: false, scale: 1 }
]

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
  if (event.key === 'Escape') {
    window.close()
  }
})

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  stars.forEach(star => {
    ctx.fillStyle = 'white'
    ctx.fillRect(star.x + offsetX * 0.1, star.y + offsetY * 0.1, star.size, star.size)
  })

  panels.forEach(panel => {
    const drawWidth = panel.width * panel.scale
    const drawHeight = panel.height * panel.scale
    const px = panel.x + offsetX * 0.3 - (drawWidth - panel.width) / 2
    const py = panel.y + offsetY * 0.3 - (drawHeight - panel.height) / 2

    ctx.shadowColor = '#00d4ff'
    ctx.shadowBlur = 15
    ctx.strokeStyle = panel.active ? '#ffffff' : '#00d4ff'
    ctx.fillStyle = 'rgba(0, 10, 30, 0.7)'
    ctx.fillRect(px, py, drawWidth, drawHeight)

    ctx.fillStyle = 'rgba(0, 212, 255, 0.15)'
    ctx.fillRect(px, py, drawWidth, 35)

    ctx.strokeRect(px, py, drawWidth, drawHeight)

    const cornerSize = 10

    ctx.beginPath()
    ctx.moveTo(px, py + cornerSize)
    ctx.lineTo(px, py)
    ctx.lineTo(px + cornerSize, py)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(px + drawWidth - cornerSize, py)
    ctx.lineTo(px + drawWidth, py)
    ctx.lineTo(px + drawWidth, py + cornerSize)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(px, py + drawHeight - cornerSize)
    ctx.lineTo(px, py + drawHeight)
    ctx.lineTo(px + cornerSize, py + drawHeight)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(px + drawWidth - cornerSize, py + drawHeight)
    ctx.lineTo(px + drawWidth, py + drawHeight)
    ctx.lineTo(px + drawWidth, py + drawHeight - cornerSize)
    ctx.stroke()

    ctx.fillStyle = '#00d4ff'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(panel.title, px + 15, py + 22)
  })

  requestAnimationFrame(draw)
}

canvas.addEventListener('click', (event) => {
  panels.forEach(panel => {
    const px = panel.x + offsetX * 0.3
    const py = panel.y + offsetY * 0.3

    if (
      event.clientX > px &&
      event.clientX < px + panel.width &&
      event.clientY > py &&
      event.clientY < py + panel.height
    ) {
      panel.active = !panel.active
      gsap.to(panel, {
        scale: panel.active ? 1.05 : 1,
        duration: 0.3
      })
    }
  })
})

draw()