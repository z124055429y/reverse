function hook_jni() {
    let module = Process.findModuleByName('libart.so');
    if (module == null) return;
    module.enumerateSymbols().filter((value)=>{
        return value.name.includes('RegisterNatives') && value.name.includes('JNI') && !value.name.includes('Check');
    }).forEach((value)=>{
        Interceptor.attach(value.address, {
            onEnter(args) {
                let methods = args[2];
                let size = args[3].toInt32();
                Java.perform(()=>{
                    let cname = Java.cast(args[1], Java.use('java.lang.Object'));
                    console.log('class:', cname);
                })
                for (let i = 0; i < size; i++) {
                    let m = methods.add(i * Process.pointerSize * 3);
                    console.log('name:', m.readPointer().readCString());
                    let addr = m.add(Process.pointerSize*2).readPointer();
                    let module = Process.findRangeByAddress(addr);
                    if (module == null) return;
                    console.log('addr relative:', addr.sub(module.base));
                }
            },
        });
    })
}

function on_load_so(name:string, fn:Function) {
    let android_dlopen_ext = Module.findExportByName(null, 'android_dlopen_ext');
    if (android_dlopen_ext == null) return;
    Interceptor.attach(android_dlopen_ext, {
        onEnter(args) {
            this.arg0 = args[0].readCString();
        },onLeave(retval) {
            if (this.arg0.includes(name)) {
                console.log('name:', this.arg0);
                fn();
            }
        },
    })
}

export {
    hook_jni, on_load_so
}
