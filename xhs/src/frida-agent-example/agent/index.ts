import { App } from "./app/app.js"
import {V3CloudConfigRequest} from "./request/fengkong_v3_cloudconfig_request.js";

function main():void{
    console.log('start app');
    let app = new App();
    app.init();
    app.set_request([
        new V3CloudConfigRequest(),
    ]);
    app.hook();
}

setImmediate(main)
