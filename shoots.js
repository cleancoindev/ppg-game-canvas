let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
let end = document.querySelector('.end')
let endScore = document.querySelector('.end-score') //ADD SCORE STYLE LIKE PPG
let up = false
let down = false
let space = false
let shooting = false
let life = 0
let score = 0
let timeBetweenEnemies = 5 * 1000
let timeBetweenCandies = 3 * 1000
let timeoutId = null
let girlAngry = document.querySelector('#angry')
let girlCool = document.querySelector('#cool')
let girl1 = document.querySelector('#g1')
let girl2 = document.querySelector('#g2')
let girl3 = document.querySelector('#g3')
let girl
let startScreen = document.querySelector('.choose')

class Board {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.img = new Image()
    this.img.src = './images/townsville.png'
    this.img.onload = () => {
      this.draw()
    }
    this.audio = new Audio()
    this.audio.src = './ppg-audio.mp3'
    this.audio.loop = true
    this.audio2 = new Audio()
    this.audio2.src = './ppg-end.mp3'
    this.audio2.loop = true

  }
  draw() {
    this.x--
    if (this.x < -canvas.width) {
      this.x = 0
    }
    context.drawImage(this.img, this.x, this.y, this.width, this.height)
    context.drawImage(
      this.img,
      this.x + canvas.width,
      this.y,
      this.width,
      this.height,
    )
  }
}

class Powergirl {
  constructor(x, y, length, height, speed, num) {
    this.x = x
    this.y = y
    this.l = length
    this.height = height
    this.s = speed
    this.srcImage = this.chooseGirl(num)
  }

  chooseGirl(g) {
    let img1 = './images/blossom.png'
    let img2 = './images/bubbles.png'
    let img3 = './images/buttercup1.png'
    let images = [img1, img2, img3]
    return images[g]
  }

  draw() {
    let image = new Image()
    image.src = this.srcImage
    context.drawImage(image, this.x, this.y, this.l, this.height)
  }
}

class Enemy {
  constructor(x, y, length, speed) {
    this.x = x
    this.y = y
    this.l = length
    this.s = speed
    let index = Math.round((Math.random() * 6))
    this.srcImage = this.chooseEnemy(index)
  }

  chooseEnemy(num) {
    let imgv1 = './images/mojo-jojo.png'
    let imgv2 = './images/sedusa.png'
    let imgv3 = './images/him.png'
    let imgv4 = './images/ameaba.png'
    let imgv5 = './images/princess.png'
    let imgv6 = './images/gruber.png'
    let imgv7 = './images/snake.png'
    let images = [imgv1, imgv2, imgv3, imgv4, imgv5, imgv6, imgv7]
    return images[num]
  }

  draw() {
    let image = new Image()
    image.src = this.srcImage
    context.drawImage(image, this.x, this.y, this.l, this.l)
  }
}

let enemies = []
let enemyBaseSpeed = 2
function makeEnemy() {
  let enemyX = canvas.width
  let enemySize = Math.round((Math.random() * 100)) + 45
  let enemyY = Math.round(Math.random() * (canvas.height - enemySize * 2)) + enemySize
  let enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed
  enemies.push(new Enemy(enemyX, enemyY, enemySize, enemySpeed))
}

//Background
const board = new Board()


//console.log(girl)

class Laser {
  constructor(x, y, length, height, speed) {
    this.x = x
    this.y = y
    this.l = length
    this.height = height
    this.s = speed
    this.imgpow = new Image()
    this.imgpow.src = './images/power.png'
    this.audio = new Audio()
    this.audio.src = './ppg-laser.mp3'
  }

  draw() {
    context.drawImage(this.imgpow, this.x, this.y, this.l, this.height)
  }
}

const bullet = new Laser(0, 0, 100, 14, 10)

function isWithin(a, b, c) {
  return (a > b && a < c)
}

function isColliding(a, b) {
  let result = false
  if (isWithin(a.x, b.x, b.x + b.l) || isWithin(a.x + a.l, b.x, b.x + b.l)) {
    if (isWithin(a.y, b.y, b.y + b.l) || isWithin(a.y + a.l, b.y, b.y + b.l)) {
      result = true
    }
  }
  return result
}

function startGame() {
  canvas.focus()
  timeoutId = setInterval(makeEnemy, timeBetweenEnemies, timeBetweenCandies)
  board.draw()
  setTimeout(makeEnemy, 1000)
  draw()
}

function endGame() {
  board.audio2.play()
  board.draw()
  clearInterval(timeoutId)
  erase()
  context.font = '50px Sonsie One'
  board.draw()
  context.fillStyle = '#213867'
  context.fillText('Game Over.', canvas.width / 2 - 200, canvas.height / 2)
  scoreHearts(score)
}

function scoreHearts(score) {
  board.audio.currentTime = 0
  board.audio.pause()
  end.style.display = 'flex'
  endScore.innerHTML = `Your Score: ${score}`
  if (score > 5) {
    girlCool.style.display = 'flex'
  } else {
    girlAngry.style.display = 'flex'
    end.classList.add('fail')
  }
}

canvas.addEventListener('keydown', function (event) {
  event.preventDefault()
  if (event.keyCode === 38) { // UP
    up = true
  }
  if (event.keyCode === 40) { // DOWN
    down = true
  }
  if (event.keyCode === 32) { // SPACE
    shoot()

  }
  if (event.keyCode === 13) {
    board.audio.play()
    return startGame()
  }
})

canvas.addEventListener('keyup', function (event) {
  event.preventDefault()
  if (event.keyCode === 38) { // UP 
    up = false
  }
  if (event.keyCode === 40) { // DOWN
    down = false
  }
})

function erase() {
  context.fillRect(0, 0, 800, 400)
}

function shoot() {
  bullet.audio.play()
  if (!shooting) {
    shooting = true
    bullet.x = girl.x + girl.l
    bullet.y = girl.y + girl.height / 2
  }
}

girl1.addEventListener('click', function (e) {
  girl = new Powergirl(50, canvas.height / 2, 150, 68, 5, 0)
  startScreen.className += ' hide'
})

girl2.addEventListener('click', function (e) {
  girl = new Powergirl(50, canvas.height / 2, 150, 68, 5, 1)
  startScreen.className += ' hide'
})

girl3.addEventListener('click', function (e) {
  girl = new Powergirl(50, canvas.height / 2, 150, 68, 5, 2)
  startScreen.className += ' hide'
})

//Draw all
function draw() {
  erase()
  board.draw()
  let gameOver = false

  enemies.forEach(function (enemy) {
    enemy.draw()
    enemy.x -= enemy.s
    if (enemy.x < 0) {
      if(life < 1) {
        gameOver = true
      }
    }
    context.fillStyle = '#111'
  })

  enemies.forEach(function (enemy) {
    if (isColliding(enemy, girl)) {
      enemy.draw()
      
      if(life < 1) {
        gameOver = true
      }
    }
  })

  if (down) {
    girl.y += girl.s
  }
  if (up) {
    girl.y -= girl.s
  }

  if (girl.y < 0) {
    girl.y = 0
  }
  if (girl.y > canvas.height - girl.height) {
    girl.y = canvas.height - girl.height
  }

  girl.draw()

  if (shooting) {

    bullet.x += bullet.s

    enemies.forEach(function (enemy, i) {

      enemy.draw()
      if (isColliding(bullet, enemy)) {
        enemies.splice(i, 1)
        score++
        shooting = false

        if (score > 3 && timeBetweenEnemies > 1000) {
          enemyBaseSpeed = 3
          clearInterval(timeoutId)
          timeBetweenEnemies -= 600
          timeoutId = setInterval(makeEnemy, timeBetweenEnemies)
        } else if (score > 3 && score < 5) {
          enemyBaseSpeed = 3
        } else if (score > 5 && score <8) {
          enemyBaseSpeed += 4
        }
      }

    })

    if (bullet.x > canvas.width) {
      shooting = false
    }

    context.fillStyle = '#111'
    bullet.draw()
  }

  context.font = '24px Sonsie One'
  context.textAlign = 'left'
  context.fillText('Score: ' + score, 1, 24)

  if (gameOver) {
    endGame()
  } else {
    window.requestAnimationFrame(draw)
  }
}

