import dagre from "@dagrejs/dagre";

const nodeWidth = 180;
const nodeHeight = 70;

export function getLayoutedElements(nodes, edges) {

    const dagreGraph = new dagre.graphlib.Graph();

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
        rankdir: "TB",   // Top -> Bottom
        ranksep: 120,
        nodesep: 60,
    });

    nodes.forEach((node) => {

        dagreGraph.setNode(node.id, {
            width: nodeWidth,
            height: nodeHeight,
        });

    });

    edges.forEach((edge) => {

        dagreGraph.setEdge(edge.source, edge.target);

    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {

        const position = dagreGraph.node(node.id);

        return {

            ...node,

            position: {
                x: position.x - nodeWidth / 2,
                y: position.y - nodeHeight / 2,
            }

        };

    });

    return {

        nodes: layoutedNodes,

        edges

    };

}