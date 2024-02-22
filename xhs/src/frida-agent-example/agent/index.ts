import { App } from "./app/app.js"
import {V3CloudConfigRequest} from "./request/fengkong_v3_cloudconfig_request.js";
import {V3ProfileAndroidRequest} from "./request/fengkong_v3_profile_android_request.js";

function main():void{
    console.log('start app');
    let app = new App();
    app.init();
    app.set_request([
        // new V3CloudConfigRequest(),
        new V3ProfileAndroidRequest(),
    ]);
    app.hook();
}

setImmediate(main)
