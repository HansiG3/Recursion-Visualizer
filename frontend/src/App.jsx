import { useState } from "react";

import { visualizeRecursion } from "./services/api";
import TreeCanvas from "./components/TreeCanvas";

import "./App.css";

function App() {

    const [code, setCode] = useState("");
    const [tree, setTree] = useState(null);

    async function handleVisualize() {

        try {

            const result = await visualizeRecursion(code);

            console.log(result);
            console.log(result.tree)
            setTree(result.tree);

        }

        catch (err) {

            alert(err.message);

        }

    }

    return (

        <div
            style={{
                padding: "30px",
                fontFamily: "Arial"
            }}
        >

            <h1>Recursion Visualizer</h1>

            <textarea
                rows={15}
                cols={80}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write recursive C++ code here..."
            />

            <br />
            <br />

            <button
                onClick={handleVisualize}
                style={{
                    padding: "10px 20px",
                    cursor: "pointer"
                }}
            >
                Visualize
            </button>

            <TreeCanvas tree={tree} />

        </div>

    );

}

export default App;