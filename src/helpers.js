
export function printLocation() {
    
    // retrieve the current generated location from the call stack
    const callsite = captureStackTrace()[0]; // <-------------- retrieved location
    const generatedLoc = {
        source: callsite.getFileName(), // this should be full URL to dist/main.js
        line: callsite.getLineNumber(),
        column: callsite.getColumnNumber(),
    };
    console.log("Generated location", generatedLoc);
    
    // retrieve the original location using source map
    fetch("dist/main.js.map")
        .then(response => response.json())
        .then(mapData => new sourceMap.SourceMapConsumer(mapData))
        .then(consumer => {
            const originalLoc = consumer.originalPositionFor({
                line: generatedLoc.line, 
                column: generatedLoc.column,
            });
            console.log("Original location", originalLoc);
            
            // print a URL that Chrome should make clickable
            console.log("Original location (clickable): " + originalLoc.source + ":" + originalLoc.line);
        });
}

function captureStackTrace() {
    const oldPrepare = Error.prepareStackTrace;
    Error.prepareStackTrace = ((error, stack) => stack);
    const obj = {};
    Error.captureStackTrace(obj);
    const stack = obj.stack;
    Error.prepareStackTrace = oldPrepare;
    return stack.slice(1);
}