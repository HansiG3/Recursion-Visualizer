const fs=require("fs");
const path=require("path");
const {execSync}=require("child_process");
const instrument=require("./instrumentation/instrumenter");
const parseTrace = require("./utils/traceParser");
const buildTree = require("./utils/treeBuilder");

function execute(code){
    const result=instrument(code);
    const cppPath=path.join(
        __dirname,
        "instrumentation",
        "instrumented.cpp"
    );
    fs.writeFileSync(cppPath,result.instrumentedCode);
    const exeName=process.platform==="win32"?"program.exe":"program";
    const exePath=path.join(__dirname,"instrumentation",exeName);
    try{
        execSync(
            `g++ "${cppPath}" -o "${exePath}"`,
            {
                stdio:"pipe"
            }
        );
    }catch(err){
        throw new Error(
            "Compilation Failed\n\n"+
            err.stderr.toString()
        );
    }
    let output;
    let events;
    let tree;
    try{
        output=execSync(`${exePath}`,{
            stdio:"pipe"
        }).toString();
        events=parseTrace(output);
        tree=buildTree(events);
    }catch(err){
        throw new Error(
            "Runtime Error\n\n"+
            err.stderr.toString()
        );
    }
    return {
        output,
        events,
        tree,
        instrumentedCode:result.instrumentedCode
    };

}
module.exports=execute;