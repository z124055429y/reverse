function log(message: string): void {
    console.log(message);
}

function printCStackTrace(name: string, context?:CpuContext): void {
    console.log(name + ' called from:\n' +
        Thread.backtrace(context, Backtracer.ACCURATE)
        .map(DebugSymbol.fromAddress).join('\n') + '\n');
}

export {
    log, printCStackTrace
}
