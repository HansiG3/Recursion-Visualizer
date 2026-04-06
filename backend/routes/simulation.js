const express=require('express');
const router=express.Router();
const simulateFactorial=require('../utils/factorial');
const simulateFibonacci=require('../utils/fibonacci');
router.post('/',async(req,res)=>{
    try{
        const {function:funcName,input}=req.body;
        if(!funcName || input==undefined){
            return res.status(400).json({error:"Invalid input"});
        }
        if(funcName==="factorial"){
            const steps=simulateFactorial(input);
            return res.json(steps);
        }
        else if(funcName=="fibonacci"){
            const steps=simulateFibonacci(input);
            return res.json(steps);
        }
        return res.status(400).json({error:"Function not supported"});
    }
    catch(err){
        res.status(500).json({error:"Something went wrong"});
    }
});
module.exports=router;