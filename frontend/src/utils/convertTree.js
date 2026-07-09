export function convertTree(tree) {

    if (!tree) {
        return {
            nodes: [],
            edges: []
        };
    }

    const nodes = [];
    const edges = [];

    Object.values(tree.nodes).forEach((node) => {

        nodes.push({
            id: String(node.id),

            data: {
                label: `${node.functionName}(${node.args.join(", ")}) = ${node.returnValue}`
            }
        });

        node.children.forEach((childId) => {

            edges.push({
                id: `${node.id}-${childId}`,
                source: String(node.id),
                target: String(childId)
            });

        });

    });

    return {
        nodes,
        edges
    };
}