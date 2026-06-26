const Parser = require("tree-sitter");
const CPP = require("tree-sitter-cpp");

// ----------------------
// Create parser
// ----------------------
const parser = new Parser();
parser.setLanguage(CPP);

// ----------------------
// Sample C++ Code
// ----------------------
const code = `
int fact(int n)
{
    if(n == 0)
        return 1;

    return n * fact(n - 1);
}
`;

// ----------------------
// Parse
// ----------------------
const tree = parser.parse(code);

// ----------------------
// Find Function
// ----------------------
const root = tree.rootNode;

const functionNode = root.namedChildren.find(
    node => node.type === "function_definition"
);

if (!functionNode) {
    console.log("No function found.");
    process.exit();
}

// ----------------------
// Extract Information
// ----------------------
const returnType = functionNode.childForFieldName("type");

const declarator = functionNode.childForFieldName("declarator");

const functionNameNode = declarator.namedChildren.find(
    child => child.type === "identifier"
);

const parameters = declarator.childForFieldName("parameters");

const body = functionNode.childForFieldName("body");

// ----------------------
// Print Information
// ----------------------
console.log("\n========== FUNCTION DETAILS ==========\n");

console.log("Function Name:");
console.log(functionNameNode.text);

console.log("\nReturn Type:");
console.log(returnType.text);

console.log("\nParameters:");
console.log(parameters.text);

console.log("\nFunction Body:");
console.log(body.text);

// ----------------------
// Traverse AST
// ----------------------
function traverse(node) {

    if (node.type === "call_expression") {

        const calledFunction = node.childForFieldName("function");

        console.log("\nFunction Call Found:");
        console.log(calledFunction.text);

        if (calledFunction.text === functionNameNode.text) {

            console.log(">>> Recursive Call Detected <<<");

        }

    }

    for (const child of node.namedChildren) {
        traverse(child);
    }
}

// ----------------------
// Start Traversal
// ----------------------
console.log("\n========== SEARCHING FOR FUNCTION CALLS ==========");

traverse(body);