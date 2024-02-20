import {Hookable} from '../hook.js';
import { anti_frida } from './anti_frida.js'

class App implements Hookable {
    request_list:Hookable[] = new Array();

    init():void {
        anti_frida();
    }

    set_request(requests:Hookable[]) {
        this.request_list = requests;
    }

    hook():void {
        this.request_list.forEach((value)=>{
            value.hook();
        });
    }
}


export {
    App
}
