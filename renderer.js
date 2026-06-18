const canvas = document.getElementById('space')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const stars = []
let offsetX = 0
let offsetY = 0
let lastX = 0
let lastY = 0


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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    stars.forEach(star => {
        ctx.fillStyle = 'white'
        ctx.fillRect(star.x + offsetX * 0.1, star.y + offsetY * 0.1, star.size, star.size)
    })

    requestAnimationFrame(draw)
}

draw()