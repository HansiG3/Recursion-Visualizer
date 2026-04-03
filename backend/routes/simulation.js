const express=require('express');
const router=express.Router();

router.post('/',async(req,res)=>{
    try{
        const {function:funcName,input}=req.body;
        if(!funcName || input==undefined){
            return res.status(400).json({error:"Invalid input"});
        }
        if(funcName==="factorial"){
            const steps=[];
            function factorial(n){
            steps.push({type:"call","function":"factorial",value:n});
            if(n===1){
                steps.push({type:"return",value:1,result:1});
                return 1;
            }
            const result=n*factorial(n-1);
            steps.push({type:"return",value:n,result:result});
            return result;
            }
            factorial(input);
            return res.json(steps);
        }
        return res.status(400).json({error:"Function not supported"});
    }
    catch(err){
        res.status(500).json({error:"Something went wrong"});
    }
});
module.exports=router;