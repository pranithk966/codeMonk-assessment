'use strict'

function getMousePos(evt, can) {
  var rect = can.getBoundingClientRect()
  return {
    x: evt.clientX - rect.x,
    y: evt.clientY - rect.y,
  }
}

function clearAllIntervals() {
  var id = window.setTimeout(() => {}, 0)
  while (id--) {
    window.clearInterval(id)
  }
}

class Arc {
  constructor(x, y, r, ccw) {
    this.x = x
    this.y = y
    this.r = r
    this.ccw = ccw
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x - offset.x, this.y - offset.y, this.r, 0, Math.PI, this.ccw)
    ctx.stroke()
  }
}

document.getElementById('stop').onclick = clearAllIntervals
document.getElementById('zi').onclick = () => {
  scale += 0.25
  ctx.scale(scale, scale)
}
document.getElementById('zo').onclick = () => {
  scale -= 0.25
  ctx.scale(scale, scale)
}
document.getElementById('cls').onclick = () => {
  arcs.splice(0, arcs.length)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
document.getElementById('hm').onclick = () => {
  offset = { x: 0, y: 0 }
}
document.getElementById('anim').onclick = () => {
  var speed = parseInt(document.getElementById('spd').value)
  var size = parseInt(document.getElementById('size').value)
  if (speed && size) {
    draw(speed, size)
  }
}

addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})
addEventListener('mousedown', (e) => {
  pos = getMousePos(e, canvas)
})
addEventListener('mouseup', () => {
  pos = undefined
})
addEventListener('mousemove', (e) => {
  if (pos !== undefined) {
    var mouse = getMousePos(e, canvas)
    offset.x += pos.x - mouse.x
    offset.y += pos.y - mouse.y
    pos = mouse
  }
})

const canvas = document.getElementById('disp')
const ctx = canvas.getContext('2d')
var arcs = []
var offset = { x: 0, y: 0 }
var pos = undefined
var scale = 1
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function draw(spd, siz) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  clearAllIntervals()

  var xPos = 0
  var used = []
  arcs = []
  var i = siz

  var drawNext = () => {
    if (i > 2500) {
      return null
    }
    let next = xPos - i
    if (used.includes(next) || next < 1) {
      next = xPos + i
    }
    let rad = (next - xPos) / 2
    arcs.push(
      new Arc(xPos + rad, canvas.height / 2, Math.abs(rad), (i / siz) % 2 || 0)
    )
    used.push(next)
    xPos = next
    i += siz
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    arcs.forEach((arc) => {
      arc.draw()
    })
    setTimeout(drawNext, 1000 / spd)
  }

  drawNext()
}
