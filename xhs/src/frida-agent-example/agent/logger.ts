function log(message: string): void {
    console.log(message);
}

function printCStackTrace(name: string, context?:CpuContext): void {
    console.log(name + ' called from:\n' +
        Thread.backtrace(context, Backtracer.ACCURATE)
        .map(DebugSymbol.fromAddress).join('\n') + '\n');
}

function printJavaStackTrace() {
    console.log(Java.use('android.util.Log').getStackTraceString(Java.use('java.lang.Throwable').$new()));
}

export {
    log, printCStackTrace, printJavaStackTrace
}
