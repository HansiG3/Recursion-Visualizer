const instrument = require("./instrumentation/instrumenter");

const code = `
#include <iostream>
using namespace std;

int fact(int n)
{
    if(n==1)
        return 1;

    return n*fact(n-1);
}

int main()
{
    cout << fact(5);
}
`;

const result = instrument(code);

console.log("========== Instrumented Code ==========\n");
console.log(result.instrumentedCode);

console.log("\n========== Return Statements ==========\n");
console.log(result.returnStatements);

console.log("\n========== Recursive Calls ==========\n");
console.log(result.recursiveCalls);