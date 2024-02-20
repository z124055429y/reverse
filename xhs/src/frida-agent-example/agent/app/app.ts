import { anti_frida } from './anti_frida.js'

class App {
    constructor() {

    }

    init():void {
        anti_frida();
    }

    hook():void {

    }
}


export {
    App
}
