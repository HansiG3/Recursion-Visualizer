import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { convertTree } from "../utils/convertTree";
import { getLayoutedElements } from "../utils/layout";

function TreeCanvas({ tree }) {

    if (!tree) {

        return <p>No tree generated.</p>;

    }

    const { nodes, edges } = convertTree(tree);
    console.log(nodes);
    console.log(edges);
    const layout = getLayoutedElements(nodes, edges);
    console.log(layout);

    return (

        <div
            style={{
                width: "100%",
                height: "700px",
                border: "1px solid #ccc",
                marginTop: "20px"
            }}
        >

            <ReactFlow
                nodes={layout.nodes}
                edges={layout.edges}
                fitView
            >

                <Background />

                <Controls />

            </ReactFlow>

        </div>

    );

}

export default TreeCanvas;