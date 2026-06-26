const Parser = require("tree-sitter");
const CPP = require("tree-sitter-cpp");

const parser = new Parser();
parser.setLanguage(CPP);

function instrument(code) {

    // Parse the user's code
    const tree = parser.parse(code);

    const root = tree.rootNode;

    // Find the first function definition
    const functionNode = root.namedChildren.find(
        node => node.type === "function_definition"
    );

    if (!functionNode) {
        throw new Error("No function definition found.");
    }

    // Extract return type
    const returnType = functionNode.childForFieldName("type");

    // Extract declarator
    const declarator = functionNode.childForFieldName("declarator");

    // Extract function name
    const functionNameNode = declarator.namedChildren.find(
        child => child.type === "identifier"
    );

    // Extract parameters
    const parameters = declarator.childForFieldName("parameters");

    // Extract body
    const body = functionNode.childForFieldName("body");

    // Detect recursive calls
    let recursiveCalls = [];

    function traverse(node) {

        if (node.type === "call_expression") {

            const calledFunction = node.childForFieldName("function");

            if (
                calledFunction &&
                calledFunction.text === functionNameNode.text
            ) {
                recursiveCalls.push({
                    function: calledFunction.text,
                    text: node.text,
                    start: node.startPosition,
                    end: node.endPosition
                });
            }
        }

        for (const child of node.namedChildren) {
            traverse(child);
        }
    }

    traverse(body);

    return {

        functionName: functionNameNode.text,

        returnType: returnType.text,

        parameters: parameters.text,

        body: body.text,

        isRecursive: recursiveCalls.length > 0,

        recursiveCalls

    };

}

module.exports = instrument;