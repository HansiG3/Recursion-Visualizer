import { useState } from "react";   
import {useEffect } from "react";
function App(){
    const [input,setInput]=useState("");
    const [steps,setSteps]=useState([]);
    const [stack,setStack]=useState([]);
    const [currentStep,setCurrentStep]=useState(0);
    const [funcName,setFuncName]=useState("factorial");
    async function handleSimulate(){
        const res=await fetch("http://localhost:5000/api/simulate",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                function:funcName,
                input:Number(input),
            }),
        });
        const data=await res.json();
        setSteps(data);
        setStack([]);
        setCurrentStep(0);
    }
    useEffect(()=>{
        if(currentStep>=steps.length)return;
        const timer=setTimeout(()=>{
            const step=steps[currentStep];
            if(step.type==="call"){
                setStack(prev=>[...prev,{value:step.value}]);
            }
            else if(step.type==="return"){
                setStack(prev=>{
                    const newStack=[...prev];
                    newStack[newStack.length-1]={
                        ...newStack[newStack.length-1],
                        result:step.result,
                    };
                    return newStack;
                });
                setTimeout(()=>{
                    setStack(prev=>prev.slice(0,-1));
                },2000);
            }
            setCurrentStep(prev=>prev+1);
        },2500);
        return ()=>clearTimeout(timer);
    },[currentStep,steps]);
    return(
        <div>
            <h1>Recursion Visualizer</h1>
            <select value={funcName} onChange={(e) => setFuncName(e.target.value)}>
            <option value="factorial">Factorial</option>
            <option value="fibonacci">Fibonacci</option>
            </select>
            <input type="number"
            value={input}
            onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={handleSimulate}>
                Simulate
            </button>
            <div style={{ marginTop: "20px" }}>
                {stack.map((item, index) => (
                <div
                    key={index}
                    style={{
                    border: "2px solid black",
                    padding: "10px",
                    margin: "5px",
                    width: "200px",
                    backgroundColor: "#f0f0f0",
                    }}
                >
                    <div>{funcName}({item.value})</div>
                    <div>result: {item.result ?? "?"}</div>
                </div>
                ))}
            </div>
        </div>
    );
}
export default App