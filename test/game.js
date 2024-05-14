import { Renderer, Vector2, Enum, InputManager } from "../physics-engine/index.js";

const mainCanvas = document.querySelector('canvas')
const mainRenderer = new Renderer(mainCanvas)

const rendererWidth = window.innerHeight / 1.1
const rendererHeight = window.innerHeight / 1.1

const inputs = new InputManager({
    Horizontal: {'a': -1, 'd': 1},
    Vertical: {'w': -1, 's': 1},
    Rotate: {'ArrowLeft': -1, 'ArrowRight': 1}
})

const moveSpeed = 350
const rotateSpeed = 100
let box1, box2

function Start() {
    box1 = mainRenderer.Instantiate({
        position: new Vector2(250, 250),
        size: new Vector2(50, 50),
        shape: Enum.Shape.Box,
        color: 'blue'
    })
    box2 = mainRenderer.Instantiate({
        position: new Vector2(450, 450),
        size: new Vector2(50, 50),
        shape: Enum.Shape.Box,
        color: 'yellow'
    })

    let b = new Vector2(8, 10)
    let c = new Vector2(10, 0)
    // console.log(b.mul(c).div(c.magnitude))
    // console.log(b.dot(c))
}

function Update(deltaTime) {
    mainRenderer.Clear()
    mainRenderer.DrawText(`DeltaTime: ${String(deltaTime).slice(0, 8)}`, new Vector2(2, 15))

    box1.Move(new Vector2(
        inputs.get('Horizontal') * moveSpeed * deltaTime,
        inputs.get('Vertical') * moveSpeed * deltaTime
    ))

    box1.Rotate(inputs.get('Rotate') * rotateSpeed * deltaTime)

    let isColliding = box1.IsCollidingWith(box2)
    box1.color = isColliding ? 'red' : 'blue'
}

setTimeout(() => {
    mainRenderer.Start({
        Start,
        Update,
        rendererWidth,
        rendererHeight,
        substeps: 1,
    })
}, 0)

