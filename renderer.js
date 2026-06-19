const canvas = document.getElementById('space')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const stars = []
let offsetX = 0
let offsetY = 0
let lastX = 0
let lastY = 0

const panels = [
  { x: 100, y: 100, width: 300, height: 200, title: 'Spotify' },
  { x: 500, y: 150, width: 300, height: 200, title: 'Discord' },
  { x: 300, y: 400, width: 300, height: 200, title: 'Files' }
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
        ctx.shadowColor = '#00d4ff'
        ctx.shadowBlur = 15
        ctx.strokeStyle = '#00d4ff'
        ctx.fillStyle = 'rgba(0, 10, 30, 0.7)'
        ctx.fillRect(panel.x + offsetX * 0.3, panel.y + offsetY * 0.3, panel.width, panel.height)

        ctx.fillStyle = 'rgba(0, 212, 255, 0.15)'
        ctx.fillRect(
            panel.x + offsetX * 0.3,
            panel.y + offsetY * 0.3,
            panel.width,
            35
            )
        
        ctx.strokeRect(
            panel.x + offsetX * 0.3,
            panel.y + offsetY * 0.3,
            panel.width,
            panel.height
        )
        const px = panel.x + offsetX * 0.3
        const py = panel.y + offsetY * 0.3
        const cornerSize = 10

            ctx.beginPath()
            ctx.moveTo(px, py + cornerSize)
            ctx.lineTo(px, py)
            ctx.lineTo(px + cornerSize, py)
            ctx.stroke()
            // top right

            // top right
            ctx.beginPath()
            ctx.moveTo(px + panel.width - cornerSize, py)
            ctx.lineTo(px + panel.width, py)
            ctx.lineTo(px + panel.width, py + cornerSize)
            ctx.stroke()

            // bottom left
            ctx.beginPath()
            ctx.moveTo(px, py + panel.height - cornerSize)
            ctx.lineTo(px, py + panel.height)
            ctx.lineTo(px + cornerSize, py + panel.height)
            ctx.stroke()

            // bottom right
            ctx.beginPath()
            ctx.moveTo(px + panel.width - cornerSize, py + panel.height)
            ctx.lineTo(px + panel.width, py + panel.height)
            ctx.lineTo(px + panel.width, py + panel.height - cornerSize)
            ctx.stroke()

        ctx.fillStyle = '#00d4ff'
        ctx.font = 'bold 16px Arial'
        ctx.fillText(
            panel.title,
            panel.x + 15 + offsetX * 0.3,
            panel.y + 22 + offsetY * 0.3
        )
})

    requestAnimationFrame(draw)
}

draw()