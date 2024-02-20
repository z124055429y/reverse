import { App } from "./xhs/app.js"

function main():void{
    console.log('start app');
    let app = new App();
    app.init();
}

setImmediate(main)
