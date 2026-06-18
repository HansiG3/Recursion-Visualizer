const express=require('express');
const router=express.Router();
const fs=require('fs');
const path=require('path');
const {exec}=require('child_process');
router.post('/',(req,res)=>{
    const {code}=req.body;
    if(!code){
        return res.status(400).json({
            error:"No code provided"
        });
    }
    const tempDir=path.join(__dirname,'..','temp');
    if(!fs.existsSync(tempDir)){
        fs.mkdirSync(tempDir);
    }
    const cppPath=path.join(tempDir,'user.cpp');
    const exePath=path.join(tempDir,'user.exe');
    fs.writeFileSync(cppPath,code);
    const compileCommand=`g++ "${cppPath}" -o "${exePath}"`;
    exec(compileCommand,(compileError,compileStdErr)=>{
        if(compileError){
            return res.status(400).json({
                success:false,
                stage:"compilation",
                error:compileStdErr
            });
        }
        exec(`"${exePath}"`,(runError,stdout,stderr)=>{
            if(runError){
                console.log(runError);
                return res.status(400).json({
                    success:false,
                    stage:"execution",
                    error:runError.message,
                    stderr:stderr
                });
            }
            return res.json({
                success:true,
                output:stdout
            });
        });
    });
});
module.exports=router;