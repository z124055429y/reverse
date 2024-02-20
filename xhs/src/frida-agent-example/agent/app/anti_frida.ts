function anti_frida():void {
    hook_linker64();
}

/**
 *
 * Runtime.java     nativeLoad()
 * Runtime.c        Runtime_nativeLoad()
 * OpenjdkJvm.cc    JVM_NativeLoad()
 * java_vm_ext.cc   LoadNativeLibrary()
 * native_loader.cpp    OpenNativeLibrary()
 * libdl.cpp        android_dlopen_ext()
 * dlfcn.cpp        __loader_android_dlopen_ext()
 * linker.cpp       dlopen_ext()
 *                  find_library()
 *                  find_libraries()
 *
 * patch code in libmsaoaidsec.so
 */
function hook_linker64():void {

    Process.findModuleByName('linker64')?.enumerateSymbols().filter((value)=>{
        return value.name.includes('find_libraries');
    }).forEach((value)=>{
        Interceptor.attach(value.address, {
            onEnter(args) {
                // console.log('name:', args[2].readPointer().readCString());
                this.arg2 = args[2].readPointer().readCString();
                this.arg4 = args[4];
            }, onLeave(_) {
                if (this.arg2.includes('libmsaoaidsec.so')) {
                    /**
                     * http://androidxref.com/9.0.0_r3/xref/bionic/linker/linker_soinfo.h#107
                     */
                    let module_base = this.arg4.readPointer().add(2 * Process.pointerSize).readPointer();
                    nop(module_base.add(0x17FC8));
                    nop(module_base.add(0x16EF4));
                }
            },
        });
    });
}

/**
 * nop action
 */
function nop(addr: NativePointer):void {
    Memory.patchCode(addr, 4, code => {
        let writer = new Arm64Writer(code, {pc:addr});
        writer.putNop();
        writer.flush();
    })
}

/**
 * onEnter pthread_create: libmsaoaidsec.so 0x175f8
 * onEnter pthread_create: libmsaoaidsec.so 0x16d30
 * 
 * 0x175f8 --> 0x17FC8
 * 0x16d30 --> 0x16EF4
 */
function hook_pthread_create():void {
    let pthread_create = Module.findExportByName(null, "pthread_create");
    if (pthread_create == null) return;

    Interceptor.attach(pthread_create, {
        onEnter(args) {
            let m = Process.findModuleByAddress(args[2]);
            if (m?.name.includes('libmsaoaidsec')) {
                console.log("onEnter pthread_create:", m.name, args[2].sub(m.base));
            }
        },
    })
}

export {
    anti_frida
}
