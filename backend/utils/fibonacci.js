function simulateFibonacci(n){
    const steps=[];
    function fibonacci(x){
        steps.push({
            type:"call",
            function:"fibonacci",
            value:x
        });

        if(x==0||x==1){
            steps.push({
                type:"return",
                function:"fibonacci",
                value:x,
                result:x
            });
            return x;
        }
        const left=fibonacci(x-1);
        const right=fibonacci(x-2);
        const result=left+right;
        steps.push({
            type:"return",
            function:"fibonacci",
            value:"x",
            result:result
        });
        return result;
    }
    fibonacci(n);
    return steps;
}
module.exports=simulateFibonacci;