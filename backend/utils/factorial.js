function simulateFactorial(n){
    const steps=[];
    function factorial(x){
        steps.push({type:"call","function":"factorial",value:x});
        if(x===1){
            steps.push({type:"return",value:1,result:1});
            return 1;
        }
        const result=x*factorial(x-1);
        steps.push({type:"return",value:x,result:result});
        return result;
    }
    factorial(n);
    return steps;
}
module.exports=simulateFactorial;