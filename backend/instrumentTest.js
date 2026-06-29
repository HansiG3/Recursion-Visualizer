const instrument = require("./instrumentation/instrumenter");

// Test Case 1 - Factorial
const code = `
int fact(int n)
{
    if(n==0)
        return 1;

    return n*fact(n-1);
}
// `;

// Uncomment to test GCD
/*
const code = `
int gcd(int a, int b)
{
    if(b==0)
        return a;

    return gcd(b,a%b);
}
`;
*/


// const code = `
// void dfs(int node, int parent, int depth)
// {
//     if(depth==5)
//         return;

//     dfs(node+1, node, depth+1);
// }
// `;


// Uncomment to test no parameter function
/*
const code = `
void solve()
{
    solve();
}
`;
*/

try {

    const result = instrument(code);

    console.log("========== FUNCTION NAME ==========");
    console.log(result.functionName);

    console.log("\n========== RETURN TYPE ==========");
    console.log(result.returnType);

    console.log("\n========== PARAMETERS ==========");
    console.log(result.parameterNames);

    console.log("\n========== RECURSIVE CALLS ==========");
    console.log(result.recursiveCalls);

    console.log("\n========== RETURN STATEMENTS ==========\n");

    if (result.returnStatements.length === 0) {

        console.log("No return statements found.");

    } else {

        result.returnStatements.forEach((ret, index) => {

            console.log(`Return Statement ${index + 1}`);
            console.log("Text       :", ret.text);
            console.log("Expression :", ret.expression);
            console.log("StartIndex :", ret.startIndex);
            console.log("EndIndex   :", ret.endIndex);
            console.log("-----------------------------");

        });

    }
    console.log("\n========== INSTRUMENTED CODE ==========\n");

    console.log(result.instrumentedCode);


}
catch(err){

    console.error("Error:");
    console.error(err.message);

}