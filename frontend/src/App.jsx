import { useState } from "react";
import { visualizeRecursion } from "./services/api";

function App() {

    const [code, setCode] = useState("");

    async function handleVisualize() {

        try {

            const result = await visualizeRecursion(code);

            console.log(result);

        }

        catch (err) {

            alert(err.message);

        }

    }

    return (

        <div
            style={{
                padding: "40px",
                fontFamily: "Arial"
            }}
        >

            <h1>Recursion Visualizer</h1>

            <textarea
                rows={18}
                cols={80}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste recursive C++ code here..."
            />

            <br /><br />

            <button
                onClick={handleVisualize}
            >
                Visualize
            </button>

        </div>

    );

}

export default App;