import Enum from "./Enum.js"
import Vector2 from "./Vector2.js"

class BodyRenderer {
    static DefaultVertices = {
        [Enum.Shape.Box]: [
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(1, 1),
            new Vector2(0, 1)
        ]
    }

    static GetVertices(body) {
        let vertices = []

        const left = -body.size.x / 2
        const right = left + body.size.x
        const bottom = -body.size.y / 2
        const top = bottom + body.size.y

        vertices[0] = new Vector2(left, top)
        vertices[1] = new Vector2(right, top)
        vertices[2] = new Vector2(right, bottom)
        vertices[3] = new Vector2(left, bottom)
        return vertices
    }

    static DrawBody(body) {
        const vertices = body.vertices
        const position = body.position.sum(new Vector2(vertices[0].x, vertices[0].y))
        body.ctx.beginPath()
        body.ctx.moveTo(position.x, position.y)

        for (let i=1; i<=vertices.length-1; i++) {
            const position = body.position.sum(new Vector2(vertices[i].x, vertices[i].y))
            body.ctx.lineTo(position.x, position.y)
        }

        body.ctx.closePath()
        body.ctx.strokeStyle = body.color
        body.ctx.lineWidth = 4
        body.ctx.stroke()

        body.ctx.strokeStyle = 'white'
        body.ctx.lineWidth = 1
    }
}

class BodyCollisor {
    static SATCollisionDetect(body1, body2) {
        let depth = Number.MAX_VALUE
        let normal = Vector2.zero

        for (let i=0; i<=3; i++) {
            let v1 = body1.vertices[i]
            let v2 = body1.vertices[(i + 1) % 4]
            let dir = v1.sub(v2).normalized

            let minA = Number.MAX_VALUE
            let minB = Number.MAX_VALUE
            let maxA = -Number.MAX_VALUE
            let maxB = -Number.MAX_VALUE

            for (let i=0; i<=3; i++) {
                let v = body1.vertices[i].sum(body1.position)
                let dot = v.dot(dir)
                if (dot < minA) {minA = dot}
                if (dot > maxA) {maxA = dot}
            }

            for (let i=0; i<=3; i++) {
                let v = body2.vertices[i].sum(body2.position)
                let dot = v.dot(dir)
                if (dot < minB) {minB = dot}
                if (dot > maxB) {maxB = dot}
            }

            if (minA >= maxB || minB >= maxA) {
                return { isColliding: false, depth, normal}
            }

            let thisDepth = Math.min(maxA - minB, maxB - minA)
            if (thisDepth < depth) {
                depth = thisDepth
                normal = dir
            }
        }

        for (let i=0; i<=3; i++) {
            let v1 = body2.vertices[i]
            let v2 = body2.vertices[(i + 1) % 4]
            let dir = v1.sub(v2).normalized

            let minA = Number.MAX_VALUE
            let minB = Number.MAX_VALUE
            let maxA = -Number.MAX_VALUE
            let maxB = -Number.MAX_VALUE

            for (let i=0; i<=3; i++) {
                let v = body2.vertices[i].sum(body2.position)
                let dot = v.dot(dir)
                if (dot < minA) {minA = dot}
                if (dot > maxA) {maxA = dot}
            }

            for (let i=0; i<=3; i++) {
                let v = body1.vertices[i].sum(body1.position)
                let dot = v.dot(dir)
                if (dot < minB) {minB = dot}
                if (dot > maxB) {maxB = dot}
            }

            if (minA >= maxB || minB >= maxA) {
                return { isColliding: false, depth, normal}
            }

            let thisDepth = Math.min(maxA - minB, maxB - minA)
            if (thisDepth < depth) {
                depth = thisDepth
                normal = dir
            }
        }

        return { isColliding: true, depth, normal }
    }

    static SATCollision(body1, body2) {
        let {isColliding, depth, normal} = BodyCollisor.SATCollisionDetect(body1, body2)
        if (isColliding) {
            console.log(normal)
            // body1.Move(normal.mul(depth).div(2).mul(-1))
            body2.Move(normal.mul(depth).div(2).mul(1))
        }

        return isColliding
    }

    static SATCollisionDebugger(body1, body2, ctx) {
        let origin = body1.position.lerp(body2.position, .5)

        for (let i=0; i<=3; i++) {
            let v1 = body1.vertices[i]
            let v2 = body1.vertices[(i + 1) % 4]
            let dir = v1.sub(v2).normalized
            let thisOrigin = origin.sum(dir.rotate(90).mul(300))

            Vector2.drawVector(thisOrigin.sum(dir.mul(-1000)), thisOrigin.sum(dir.mul(1000)), ctx)

            for (let i=0; i<=3; i++) {
                let v = body1.vertices[i].sum(body1.position)
                Vector2.drawVector(v, v.sum(dir.rotate(90).mul(1000)), ctx, 'purple')
            }

            for (let i=0; i<=3; i++) {
                let v = body2.vertices[i].sum(body2.position)
                Vector2.drawVector(v, v.sum(dir.rotate(90).mul(1000)), ctx, 'cyan')
            }
        }
    }
}

export default class Body {
    constructor ({ renderer, shape, radius = 0, position = Vector2.zero, size = Vector2.zero, color = 'white'}) {
        this.renderer = renderer
        this.ctx = this.renderer.ctx
        // this.color = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
        this.color = color;

        this.acceleration = Vector2.zero
        this.position = position
        this.lastPosition = position

        this.radius = radius
        this.shape = shape
        this.size = size
        this.vertices = BodyRenderer.GetVertices(this)
        } 

    draw() {
        BodyRenderer.DrawBody(this)
    }

    updatePhysics(deltaTime) {
        let velocity = this.position.sub(this.lastPosition)
        let currentVelocity = velocity.sum(this.acceleration.mul(deltaTime * deltaTime))
        this.lastPosition = this.position
        this.position = this.position.sum(currentVelocity)
    }

    Rotate(Angle) {
        this.vertices = this.vertices.map(v => Vector2.rotate(v, Angle))
    }

    Move(Direction) {
        this.position = this.position.sum(Direction)
    }

    IsCollidingWith(body) {
        // BodyCollisor.SATCollisionDebugger(this, body, this.ctx)
        return BodyCollisor.SATCollision(this, body)
    }
}