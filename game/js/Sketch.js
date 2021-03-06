let asteroids = []
let lasers = []
let targets = []
let w = 750
let h = 600
let d = 10
let s = 20
let rot = 90
let ship
let score = 0
let level = 1
let base = 1.1
let total = 4
let mult = Math.pow(base, level)
let goal = mult * total
let fov = 30
let fovRange = 250
let paused = false
let rate = 100
let count = 0

function setup() {
    var canvas = createCanvas(w, h)
    canvas.parent('game')
    background(80)
    start()
}

let def = .3
let move = def
let alpha = 0
/*
    w - 87
    a - 65
    s - 83
    d - 68
    space - 32
    p - 80
*/
function draw() {
    if(count == rate)
        count = 0
    count++
    if(asteroids.length == 0) {
        alert('level cleared')
        level++
        htmlLevel.innerHTML = level
        restart()
    }
    if(!paused) {
        background(80)
        drawShip()
        drawLasers()
        drawTargets()
        drawAsteroids()
        if(checkCollisions()) {
            alert('game over')
            score = 0
            level = 1
            restart()
        }
    }
    if(keyIsDown(87))
        move = 1
    else
        move = def
    if(keyIsDown(65)) {
        alpha = -2
    }
    else if(keyIsDown(68)) {
        alpha = 2
    }
    else {
        alpha = 0
    }
    if(keyIsDown(32) && count % 10 == 0) { //space
        lasers.push(ship.shoot(targets, fovRange, 'laser'))
    }
}

function keyPressed() {
    // if(keyCode == 32 && count == rate) { //space
    //     lasers.push(ship.shoot(targets, fovRange, 'laser'))
    // }
    if(keyCode == 80) { //'p'
        paused = !paused
    }
}

function mouseClicked() {
    lasers.push(ship.shoot(targets, fovRange, 'missile'))
}

function start() {
    move = def
    alpha = 0
    ship = new Ship(w/2, h/2, d, s, rot)
    ship.draw()
    generateAsteroids(goal)
}

function restart() {
    asteroids.length = 0
    lasers.length = 0
    destroyed = 0
    start()
}

function checkCollisions() {
    let filter = []
    for(let i = asteroids.length-1; i >= 0; i--) {
        if(ship.collides(asteroids[i])) {
            return true
        }
        let skip = false
        let asteroid = asteroids[i]
        let destroyed = laserHit(asteroid, i)
        for(let j = 0; j < filter.length; j++) {
            if(asteroid == filter[j])
                skip = true
        }
        if(skip || destroyed) continue
        asteroidHit(asteroid, filter)
    }
    return false
}

function asteroidHit(asteroid, filter) {
    let nearbyAsteroids = asteroid.getTargets(asteroids, asteroid.size, 360)
    for(let j = 0; j < nearbyAsteroids.length; j++) {
        let other = nearbyAsteroids[j]
        //line(asteroid.x, asteroid.y, other.x, other.y)
        if(mag(asteroid.x-other.x, asteroid.y-other.y) > asteroid.size+other.size) continue
        //if(asteroid.size < other.size && asteroid.collides(other)) {
            asteroid.split(asteroids, other, false)
            filter.push(other)
            break
        //}
    }
}

function laserHit(asteroid, index) {
    for(let j = lasers.length-1; j >= 0; j--) {
        if(asteroid.collides(lasers[j])) {
            asteroid.health -= lasers[j].damage
            if(asteroid.health <= 0) {
                asteroid.split(asteroids, lasers[j], true)
                asteroid.clearShape()
                score += Math.round(asteroid.totalHealth)
                htmlScore.innerHTML = score
                asteroids.splice(index, 1)
            }
            lasers.splice(j, 1)
            return true;
        }
    }
    return false
}

function drawShip() {
    ship.rotate(alpha)
    ship.move(move)
    ship.wrap(w, h)
    ship.draw()
    ship.drawFOV(ship.size*2, fov)
}

function drawLasers() {
    for(let i = lasers.length-1; i >= 0; i--) {
        if(lasers[i].wrap(w, h))
            lasers.splice(i, 1)
        else {
            if(lasers[i].detonate(lasers, asteroids)) {
                lasers.splice(i, 1)
                break;
            }
            lasers[i].track()
            lasers[i].move(1)
            lasers[i].draw()
        }
    }
}

function drawTargets() {
    noFill()
    targets = ship.getTargets(asteroids, fovRange, fov)
    for(let i = 0; i < targets.length; i++) {
        let target = targets[i]
        stroke(0, 255, 255)
        ellipse(target.x, target.y, 2)
    }
    fill(255)
    stroke(0)
}

function drawAsteroids() {
    for(let i = 0; i < asteroids.length; i++) {
        asteroids[i].move(1)
        asteroids[i].wrap(w, h)
        asteroids[i].draw()
        asteroids[i].displayHealth()
    }
}

function generateAsteroids(num) {
    for(let i = 0; i < num; i++) {
        let xStart
        let yStart
        let choice = Math.random()
        if(choice < .25) { //move left
            xStart = 0
            yStart = h*Math.random()
        }
        else if(choice < .5) { //move up
            xStart = w*Math.random()
            yStart = 0
        }
        else if(choice < .75) { //move right
            xStart = w
            yStart = h*Math.random()
        }
        else { //move down
            xStart = w*Math.random()
            yStart = h
        }
        let size = Math.random()*20 + 16 * mult
        let speed = Math.random()*2 + 2
        let rotation = Math.random()*360
        asteroids.push(new Asteroid(xStart, yStart, size, speed, rotation))
    }
}


