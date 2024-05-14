import { Body } from "../index.js"

export default class Renderer {
    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas 
     */
    constructor (canvas) {  
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        this.deltaTime = 0
        this.lastTick = 0

        this.bodies = []
    }

    _update(tick) {
        requestAnimationFrame((tick) => this._update(tick))

        this.deltaTime = Math.max(0, (tick - this.lastTick) / 1000) / this.props.substeps
        this.lastTick = tick

        this.props.Update(this.deltaTime)

        this.bodies.forEach(body => {
            body.draw(this.deltaTime)
        })
    }

    Start(props) {
        this.props = props
        this.canvas.width = props.rendererWidth
        this.canvas.height = props.rendererHeight
        
        props.Start()

        this.lastTick = performance.now()
        requestAnimationFrame((tick) => this._update(tick))
    }

    Instantiate(props) {
        let newBody = new Body({
            renderer: this, ...props
        })
        this.bodies.push(newBody)
        return newBody
    }

    DrawText(text, position) {
        this.ctx.font = '15px Arial'
        this.ctx.fillStyle = '#fff'
        this.ctx.fillText(text, position.x, position.y)
    }

    Clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
