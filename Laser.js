class Laser extends Projectile {
    constructor(x, y, size, speed, angle) {
        super(x, y, size, speed, angle)
        this.target;
    }

    draw() {
        let x1 = this.x + cos(this.angle)*this.size
        let y1 = this.y + sin(this.angle)*this.size
        strokeWeight(2)
        stroke(255)
        line(this.x, this.y, x1, y1)
        strokeWeight(1)
        stroke(0)
    }

    setTarget(target) {
        this.target = target
        console.log(target)
    }

    track() {
        if(this.target == null) return
        if(this.target.health == 0) return
        angleMode(DEGREES)
        let dx = this.target.x-this.x
        let dy = this.target.y-this.y
        let a = atan2(dy, dx)
        this.angle = a
    }
}