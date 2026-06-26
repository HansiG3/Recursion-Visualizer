const instrument = require("./instrumentation/instrumenter");

const code = `
int fact(int n)
{
    if(n==0)
        return 1;

    return n*fact(n-1);
}
`;

const result = instrument(code);

console.log(result);