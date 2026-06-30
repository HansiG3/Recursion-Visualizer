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


    const returnStatements=[];
    function findReturns(node){
        if(node.type==="return_statement"){
            returnStatements.push(node);
        }
        for(const child of node.namedChildren){
            findReturns(child);
        }
    }
    findReturns(body);
    console.log("Return statements Found:");
    for (const ret of returnStatements) {
        console.log("--------------------");
        console.log("Text      :", ret.text);
        console.log("Start     :", ret.startIndex);
        console.log("End       :", ret.endIndex);
        const expression = ret.namedChildren[0];
        if (expression) {
            console.log("Expression:", expression.text);
        }
        console.log("--------------------");
    }
    // -----------------------------
    // Insert trace.hpp
    // -----------------------------
    let modifiedCode =code;
    returnStatements.sort(
        (a,b)=>b.startIndex-a.startIndex
    );
    for(const ret of returnStatements){
        const expression=ret.namedChildren[0];
        if(!expression)continue;
        const replacement=
    `{
        auto __trace_result=${expression.text};
        traceReturn(__trace_result);
        return __trace_result;
    }`;

        modifiedCode=
        modifiedCode.slice(0,ret.startIndex)+
        replacement+
        modifiedCode.slice(ret.endIndex);
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
    modifiedCode =
        modifiedCode.slice(0, body.startIndex + 1) +
        traceEnterStatement +
        modifiedCode.slice(body.startIndex + 1);

    modifiedCode=
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

        returnStatements: returnStatements.map(ret => ({
        text: ret.text,
        expression: ret.namedChildren[0]?.text,
        startIndex: ret.startIndex,
        endIndex: ret.endIndex
        })),

        instrumentedCode: modifiedCode

    };

}
module.exports = instrument;