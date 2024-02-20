import { Hookable } from "../hook.js";
import {printJavaStackTrace} from "../logger.js";
import {hook_jni, on_load_so} from "../util/jni.js";

class V3CloudConfigRequest implements Hookable {
    hook():void {
        this.test_entry();
        // hook_jni();
        // this.test_smid();
        // this.test_md5();
    }

    test_md5():void {
        Java.perform(()=>{
            let c1 = Java.use('com.ishumei.O000O00000OoO.O000O00000OoO');
            c1.O000O00000OoO.overload('java.lang.String').implementation = function(...a:any) {
                console.log('set md5:', a[0]);
                printJavaStackTrace();
                this.O000O00000OoO(a[0]);
            }
            c1.O00O000O00oO.overload().implementation = function() {
                let ret = this.O00O000O00oO();
                console.log('get md5:', ret);
                return ret;
            }

            let c2 = Java.use('com.ishumei.O000O00000OoO.O000O00000OoO');
            c2.O000O00000oO.overload('java.lang.String').implementation = function(...a:any) {
                console.log('str:', a[0]);
                return this.O000O00000oO(a[0]);
            }
        });
    }

    /**
     * 算法总结:
     *
     * s1 = "%04d%02d%02d%02d%02d%02d"格式的时间
     * s2 = "/proc/sys/kernel/random/uuid"得到的uuid以0x40大小求md5
     * s3 = md5("shumei_android_sec_key_" + s1 + s2 + "00")
     * s = s1 + s2 + "00" + s3[0:14]
     */
    test_smid():void {
        // this.test_smid_java();
        on_load_so('libsmsdk', this.test_smid_native);
    }

    test_smid_native():void {
        let smsdk_module = Process.findModuleByName('libsmsdk.so');
        if (smsdk_module == null) return;
        Interceptor.attach(smsdk_module.base.add(0x50acc), {
            onEnter(_) {
                console.log('onEnter 0x50acc:');
            },onLeave(rval) {
                console.log('onLeave 0x50acc:');
                Java.perform(()=>{
                    console.log("smid:", Java.cast(rval, Java.use('java.lang.Object')));
                })
            }
        });
        Interceptor.attach(smsdk_module.base.add(0x3fdb8), {
            onEnter(args) {
                console.log('onEnter 0x3fdb8:');
                let length = args[2].toInt32();
                console.log(hexdump(args[1],{length:length}));
                this.arg0 = args[0];
            }, onLeave(_) {
                console.log(hexdump(this.arg0));
            },
        });
        Interceptor.attach(smsdk_module.base.add(0x42ff0), {
            onEnter(args) {
                console.log('onEnter 0x42ff0:');
                this.arg0 = args[0];
            },onLeave(_) {
                console.log('onLeave 0x42ff0:');
                console.log(hexdump(this.arg0));
            },
        })
    }

    test_smid_java():void {
        Java.perform(()=>{
            let c1 = Java.use('com.ishumei.O0000O000000oO.O00O0000OooO');
            c1.O000O00000o0O.implementation = function() {
                let ret = this.O000O00000o0O();
                console.log('c1 generate smid:', ret);
                return ret;
            }
        });

        /**
         * 定位具体类
         *
         * line 381: SMSDK.x5(context.getPackageName() + "_android", super.O000O00000o0O());
         *
         * x3, x5作为一对函数负责加密&解密, 真正生成smid的函数是
         * com.ishumei.smantifraud.SmAntiFraud.O0000O000000oO(com.ishumei.smantifraud.SmAntiFraud$SmOption),
         * 然后调用
         * com.ishumei.O0000O000000oO.O00O0000OooO.O000O00000o0O()
         * 并最终调用了
         * com.ishumei.dfp.SMSDK.z1(Context)
         * 
         */
        Java.perform(()=>{
            let c1 = Java.use('com.ishumei.O0000O000000oO.O00O0000OooO$O000O00000OoO');
            c1.O000O00000oO.implementation = function() {
                let ret = this.O000O00000oO();
                if (ret != null && ret.length != 0) {
                    console.log('c1 smid:', ret);
                }
                return ret;
            };
            let c2 = Java.use('com.ishumei.O0000O000000oO.O00O0000OooO$O00O0000o00O');
            c2.O000O00000o0O.implementation = function() {
                let ret = this.O000O00000o0O();
                if (ret != null && ret.length != 0) {
                    console.log('c2 smid:', ret);
                }
                return ret;
            }
            let c3 = Java.use('com.ishumei.dfp.SMSDK');
            c3.x5.implementation = function(...a:any) {
                console.log('x5 args:', a[0], a[1]);
                let ret = this.x5(a[0], a[1]);
                console.log('x5 ret:', ret);
                return ret;
            }
            c3.x3.implementation = function(...a:any) {
                console.log('x3 args:', a[0], a[1]);
                let ret = this.x3(a[0], a[1]);
                console.log('x3 ret:', ret);
                return ret;
            }
            let c4 = Java.use('com.ishumei.O0000O000000oO.O00O0000OooO$O000O00000o0O');
            c4.O0000O000000oO.overload('java.lang.String').implementation = function(...a:any) {
                console.log('put key:', a[0]);
                printJavaStackTrace();
                this.O0000O000000oO(a[0]);
            }
            let c5 = Java.use('com.ishumei.smantifraud.SmAntiFraud');
            c5.O0000O000000oO.overload('com.ishumei.smantifraud.SmAntiFraud$SmOption').implementation = function(...a:any) {
                let ret = this.O0000O000000oO(a[0]);
                console.log('SmAntiFraud generate key:', ret, 'status:', a[0].status());
                return ret;
            };

        });


        


    }

    test_entry():void {
        Java.perform(()=>{
            let c1 = Java.use('com.ishumei.O000O00000OoO.O0000O000000oO');
            c1.O0000O000000oO.overload('java.lang.String',
                                       'java.lang.String',
                                       'com.ishumei.O000O0000O0oO.O000O00000OoO$O0000O000000oO',
                                       'com.ishumei.O000O0000O0oO.O0000O000000oO')
            .implementation = function(...a:any[]) {
                console.log("request http://fp-it.fengkongcloud.com/v3/cloudconf");
                this.O0000O000000oO(a[0],a[1],a[2],a[3]);
            }
        })
    }
}

export {
    V3CloudConfigRequest
}
