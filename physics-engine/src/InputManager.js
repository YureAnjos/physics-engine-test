let pressedKeys = []
addEventListener('keydown', ({ key }) => {
    pressedKeys[key] = true
})
addEventListener('keyup', ({ key }) => {
    pressedKeys[key] = false
})

export default class InputManager {
    constructor (inputGroups) {
        this.inputGroups = inputGroups
    }

    get(group) {
        let value = 0
        
        for (const [key, scale] of Object.entries(this.inputGroups[group])) {
            if (pressedKeys[key]) {
                value += scale
            }
        }
        
        return value
    }
} 