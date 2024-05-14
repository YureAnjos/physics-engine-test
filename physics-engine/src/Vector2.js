function lerpNumber(a, b, c) {
    return a + (b - a) * c
}

export default class Vector2 {
    constructor (x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    static zero = new Vector2(0, 0)

    static drawVector(vec1, vec2, ctx, color = 'white') {
        ctx.beginPath()
        ctx.moveTo(vec1.x, vec1.y)
        ctx.lineTo(vec2.x, vec2.y)
        ctx.closePath()
        ctx.strokeStyle = color
        ctx.stroke()
        ctx.strokeStyle = 'white'
    }

    static dot(vec1, vec2) {
        return vec1.dot(vec2)
    }

    static cross(vec1, vec2) {
        return vec1.cross(vec2)
    }

    static rotate(vector, angle) {
        return vector.rotate(angle)
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    get normalized() {
        const mag = this.magnitude
        if (mag == 0) return Vector2.zero
        return new Vector2(this.x / mag, this.y / mag)
    }

    sum(vec2) {
        return new Vector2(this.x + vec2.x, this.y + vec2.y)
    }

    sub(vec2) {
        return new Vector2(this.x - vec2.x, this.y - vec2.y)
    }

    mul(vec2) {
        if (vec2 instanceof Vector2) {
            return new Vector2(this.x * vec2.x, this.y * vec2.y)
        }
        return new Vector2(this.x * vec2, this.y * vec2)
    }

    div(vec2) {
        if (vec2 instanceof Vector2) {
            return new Vector2(this.x / vec2.x, this.y / vec2.y)
        }
        return new Vector2(this.x / vec2, this.y / vec2)
    }

    dot(vec2) {
        return this.x * vec2.x + this.y * vec2.y
    }

    cross(vec2) {
        return this.x * vec2.y - this.y * vec2.x
    }

    distanceTo(vec2) {
        return this.sub(vec2).magnitude
    }

    lerp(vec2, alpha) {
        return new Vector2(lerpNumber(this.x, vec2.x, alpha), lerpNumber(this.y, vec2.y, alpha))
    }

    rotate(angle) {
        const rad = angle * (Math.PI / 180)
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)

        return new Vector2(
            cos * this.x - sin * this.y,
            sin * this.x + cos * this.y
        )
    }
}