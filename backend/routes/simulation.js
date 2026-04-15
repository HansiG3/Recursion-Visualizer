const express=require('express');
const router=express.Router();
let idCounter=0;
function resetIdCounter(){
    idCounter=0;
}
function extractBaseCases(code){
    const lines=code.split("\n");
    const baseCases=[];
    for(let line of lines){
        line=line.trim();
        if(line.startsWith("if")){
            const match=line.match(/if\s+n==(\d+)\s+return\s+(\d+)/)
            if(match){
                baseCases.push({
                    value:Number(match[1]),
                    result:Number(match[2])
                });
            }
        }
    }
    return baseCases;
}
function extractRecursiveCalls(code){
    const lines=code.split("\n");
    const calls=[];
    for (let line of lines){
        line=line.trim();
        if(line.startsWith("return")){
            const matches=line.match(/n-(\d+)/g);
            if(matches){
                for(let m of matches){
                    const num=Number(m.split("-")[1]);
                    calls.push(num);
                }
            }
        }
    }
    return calls;
}
function simulateDynamic(n,baseCases,recursiveCalls,steps=[],parentId=null){
    const currentID=idCounter++;
    steps.push({
        type:"call",
        value:n,
        id: currentID,
        parentId:parentId
    });
    for (let base of baseCases){
        if(n===base.value){
            steps.push({
                type:"return",
                value: n,
                result: base.result,
                id: currentID,
                parentId:parentId
            });
            return base.result;
        }
    }
        let result=0;
        for(let call of recursiveCalls){
            result+=simulateDynamic(n-call,baseCases,recursiveCalls,steps,currentID);
        }
        steps.push({
            type:"return",
            value:n,
            result:result,
            id: currentID,
            parentID:parentId
        });
        return result;
}
router.post('/',async(req,res)=>{
    try{
        console.log("request received");
        const {code,input}=req.body;
        const baseCases=extractBaseCases(code);
        console.log("Base Cases",baseCases);
        const recursiveCalls=extractRecursiveCalls(code);
        console.log("Recursive Calls:",recursiveCalls);
        if(!code || input==undefined){
            return res.status(400).json({error:"Invalid input"});
        }
        resetIdCounter();
        const steps = [];
        simulateDynamic(input, baseCases, recursiveCalls, steps);
        return res.json(steps);
    }
    catch(err){
        res.status(500).json({error:"Something went wrong"});
    }
});
module.exports=router;