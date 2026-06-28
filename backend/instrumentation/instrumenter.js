const Parser = require("tree-sitter");
const CPP = require("tree-sitter-cpp");

const parser = new Parser();
parser.setLanguage(CPP);

function instrument(code) {

    // -----------------------------
    // Parse Code
    // -----------------------------
    const tree = parser.parse(code);
    const root = tree.rootNode;

    // -----------------------------
    // Find Function Definition
    // -----------------------------
    const functionNode = root.namedChildren.find(
        node => node.type === "function_definition"
    );

    if (!functionNode) {
        throw new Error("No function definition found.");
    }

    // -----------------------------
    // Extract Function Details
    // -----------------------------
    const returnType = functionNode.childForFieldName("type");

    const declarator = functionNode.childForFieldName("declarator");

    const functionNameNode = declarator.namedChildren.find(
        node => node.type === "identifier"
    );

    const parameters = declarator.childForFieldName("parameters");

    const body = functionNode.childForFieldName("body");

    // -----------------------------
    // Extract Parameter Names
    // -----------------------------
    const parameterNames = [];

    for (const parameter of parameters.namedChildren) {

        const declaratorNode =
            parameter.childForFieldName("declarator");

        if (!declaratorNode) continue;

        let variableName = declaratorNode.text;

        variableName = variableName.replace(/[&*]/g, "");

        parameterNames.push(variableName);
    }

    // -----------------------------
    // Detect Recursive Calls
    // -----------------------------
    const recursiveCalls = [];

    function traverse(node) {

        if (node.type === "call_expression") {

            const calledFunction =
                node.childForFieldName("function");

            if (
                calledFunction &&
                calledFunction.text === functionNameNode.text
            ) {

                recursiveCalls.push({
                    function: calledFunction.text,
                    text: node.text,
                    startIndex: node.startIndex,
                    endIndex: node.endIndex
                });

            }
        }

        for (const child of node.namedChildren) {
            traverse(child);
        }
    }

    traverse(body);

    // -----------------------------
    // Ensure function is recursive
    // -----------------------------
    if (recursiveCalls.length === 0) {
        throw new Error("Function is not recursive.");
    }

    // -----------------------------
    // Build traceEnter()
    // -----------------------------
    let traceEnterStatement;

    if (parameterNames.length === 0) {

        traceEnterStatement =
            `\n    traceEnter("${functionNameNode.text}");\n`;

    } else {

        traceEnterStatement =
            `\n    traceEnter("${functionNameNode.text}", ${parameterNames.join(", ")});\n`;

    }

    // -----------------------------
    // Insert traceEnter()
    // -----------------------------
    let modifiedCode =
        code.slice(0, body.startIndex + 1) +
        traceEnterStatement +
        code.slice(body.startIndex + 1);

    // -----------------------------
    // Insert trace.hpp
    // -----------------------------
    modifiedCode =
`#include "trace.hpp"

${modifiedCode}`;

    // -----------------------------
    // Return Result
    // -----------------------------
    return {

        functionName: functionNameNode.text,

        returnType: returnType.text,

        parameterNames,

        recursiveCalls,

        instrumentedCode: modifiedCode

    };

}

module.exports = instrument;