import {Hookable} from "../hook.js";
import {hook_jni, on_load_so} from "../util/jni.js";

class V3ProfileAndroidRequest implements Hookable {
    hook(): void {
        // this.test_entry();
        this.test_pri();
        // hook_jni();
        // this.test_fingerprint();
        // this.test_tn();
    }

    test_tn():void {
        Java.perform(()=>{
            let c1 = Java.use('com.ishumei.O000O0000OOoO.O000O0000OOoO');
            c1.O0000O000000oO.overload('java.lang.String', '[B').implementation = function(...a:any) {
                let ret = this.O0000O000000oO(a[0], a[1]);
                console.log('c1 arg:', a[0], a[1]);
                console.log('c1 ret:', ret);
                return ret;
            };
            let c2 = Java.use("com.ishumei.O000O0000OOoO.O00O0000OooO");
            c2.O000O0000OOoO.implementation = function(...a:any) {
                let ret = this.O000O0000OOoO(a[0]);
                console.log('c2 arg:', a[0]);
                console.log('c2 ret:', ret);
                return ret;
            }
            let c3 = Java.use('com.ishumei.O000O0000OOoO.O000O0000OoO');
            c3.O0000O000000oO.overload('int').implementation = function(...a:any) {
                let ret = this.O0000O000000oO(a[0]);
                console.log('c3 content:', ret);
                return ret;
            }
        })
    }

    test_fingerprint():void {
        /**
         * s1 = pri生成的key取md5
         * iv = 0102030405060708
         * s2 = aes(s1, iv)
         * s = base64(s2)
         */
        this.test_fingerprint_java()
        on_load_so('libsmsdk', this.test_fingerprint_native);
    }

    test_fingerprint_native():void {
        let smsdk_module = Process.findModuleByName('libsmsdk.so');
        if (smsdk_module == null) return;
        Interceptor.attach(smsdk_module.base.add(0x4fd34), {
            onEnter(args) {
                console.log('onEnter 0x4fd34');
            },onLeave(retval) {
                console.log('onLeave 0x4fd34');
            },
        });

        Interceptor.attach(smsdk_module.base.add(0x43568), {
            onEnter(args) {
                console.log('onEnter 0x43568');
                console.log("arg0:", args[0].readCString());
                this.arg1 = args[1];
                this.arg2 = args[2].toInt32();
            },onLeave(retval) {
                console.log('onLeave 0x43568');
                console.log('ret:', hexdump(this.arg1, {length:this.arg2}));
            },
        })

        Interceptor.attach(smsdk_module.base.add(0x4f674), {
            onEnter(args) {
                console.log('onEnter 0x4f674');
            },onLeave(retval) {
                console.log('onLeave 0x4f674');
                console.log("ret:", hexdump(retval));
            },
        });
        Interceptor.attach(smsdk_module.base.add(0x48864), {
            onEnter(args) {
                console.log('onEnter 0x48864');
                console.log('arg0', hexdump(args[0], {length:0x20}));
                this.arg1 = args[1];
            },onLeave(retval) {
                console.log('onLeave 0x48864');
                console.log('arg1', hexdump(this.arg1, {length:0x20}));
            },
        });
        Interceptor.attach(smsdk_module.base.add(0x43cf8), {
            onEnter(args) {
                console.log('onEnter 0x43cf8');
                console.log('arg0:', hexdump(args[0]));
                console.log('arg2:', hexdump(args[2]));
                console.log('arg3:', hexdump(args[3]));
                console.log('arg5:', hexdump(args[5]));
                this.arg2 = args[2];
                
            },onLeave(retval) {
                console.log('onLeave 0x43cf8');
                console.log('arg2:', hexdump(this.arg2));
                
            },
        });
        Interceptor.attach(smsdk_module.base.add(0x4428c), {
            onEnter(args) {
                console.log('onEnter 0x4428c:')
                console.log('arg2:', hexdump(args[2]))
            },onLeave(retval) {
                console.log('onEnter 0x4428c:')
            },
        })
    }

    test_fingerprint_java():void {
        Java.perform(()=>{
            let c2 = Java.use('com.ishumei.dfp.SMSDK');
            c2.x1.overload('java.lang.String', 'java.lang.String').implementation = function(...a:any) {
                let ret = c2.x1(a[0],a[1]);
                console.log('args:', a[0], a[1]);
                console.log('ret:', ret);
                return ret;
            };
        });

    }

    test_pri():void {
        Java.perform(()=>{
            let c1 = Java.use('com.ishumei.smantifraud.SmAntiFraud$SmOption');
            c1.getPublicKey.implementation = function() {
                let ret = this.getPublicKey();
                console.log('sm public key:', ret);
                return ret;
            }

            let c2 = Java.use('com.ishumei.O000O0000OOoO.O000O0000OoO');
            c2.O0000O000000oO.overload('int').implementation = function(...a:any) {
                let ret = this.O0000O000000oO(a[0]);
                console.log('content:', ret);
                return ret;
            }

            let c3 = Java.use('com.ishumei.O000O0000OOoO.O000O0000OOoO');
            c3.O0000O000000oO.overload('java.lang.String', '[B').implementation = function(...a:any) {
                let ret = this.O0000O000000oO(a[0],a[1]);
                console.log('p0:', a[0]);
                console.log('p1:', a[1]);
                console.log('ret:', ret);
                return ret;
            }
        })
    }

    test_entry(): void {
        Java.perform(()=>{
            let c1 = Java.use('com.ishumei.O0000O000000oO.O000O0000OoO');
            c1.O0000O000000oO.overload('java.lang.String', 'boolean', 'boolean').implementation = function(...a:any) {
                console.log('request http://fp-it.fengkongcloud.com/v3/profile/android')
                console.log('params:', a[0], a[1], a[2]);
                return this.O0000O000000oO(a[0],a[1],a[2]);
            }
        });
    }

}

export {
    V3ProfileAndroidRequest
}
