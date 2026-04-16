import { useState } from "react";   
import {useEffect } from "react";
function TreeNode({ node, funcName }) {
  const isActive = node.result === null;

  let bgColor = "#e3f2fd";
  if (node.result !== null) bgColor = "#c8e6c9";
  if (isActive) bgColor = "#ffe082";

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>

      {/* BOX */}
      <div
        style={{
          border: "2px solid black",
          padding: "12px 16px",
          borderRadius: "14px",
          backgroundColor: bgColor,
          display: "inline-block",
          minWidth: "140px",
          fontWeight: "bold",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
        }}
      >
        {funcName}({node.value})
        <div style={{ marginTop: "6px" }}>
          {node.result !== null ? `= ${node.result}` : "..."}
        </div>
      </div>

      {/* CHILDREN */}
      {node.children.length > 0 && (
        <>
          {/* ARROWS */}
          <svg width="220" height="55">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill="#555" />
              </marker>
            </defs>

            {/* trunk */}
            <line
              x1="110"
              y1="0"
              x2="110"
              y2="18"
              stroke="#555"
              strokeWidth="2"
            />

            {/* left branch */}
            {node.children[0] && (
              <line
                x1="110"
                y1="18"
                x2="55"
                y2="48"
                stroke="#555"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            )}

            {/* right branch */}
            {node.children[1] && (
              <line
                x1="110"
                y1="18"
                x2="165"
                y2="48"
                stroke="#555"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            )}
          </svg>

          {/* CHILD BOXES */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "-5px"
            }}
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                funcName={funcName}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function App(){
    const [input,setInput]=useState("");
    const [steps,setSteps]=useState([]);
    const [currentStep,setCurrentStep]=useState(0);
    const [currentAction,setCurrentAction]=useState("");
    const [funcName, setFuncName] = useState("");
    const [speed,setSpeed]=useState(1000);
    const [code,setCode]=useState("");
    const [nodes,setNodes]=useState([]);

    function buildTree(nodes){
        const map={};
        const roots=[];
        nodes.forEach(node=>{
            map[node.id]={...node,children:[]};
        })
        nodes.forEach((node)=>{
            if(node.parentId===null){
                roots.push(map[node.id]);
            }
            else{
                map[node.parentId].children.push(map[node.id]);
            }
        });
        return roots;   
    }
    async function handleSimulate(){
        if(code.includes("fact")){
            setFuncName("factorial")
        }
        else if(code.includes("fib")){
            setFuncName("fibonacci");
        }
        else{
            setFuncName("function")
        }
        const res=await fetch("http://localhost:5000/api/simulate",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                code:code,
                input:Number(input),
            }),
        });
        const data=await res.json();
        setSteps(data);
        setCurrentStep(0);
        setNodes([]);
    }
    useEffect(()=>{
        if(currentStep>=steps.length)return;
        const timer=setTimeout(()=>{
            const step=steps[currentStep];
            if(!step)return;
            if(step.type==="call"){
                setCurrentAction(`Calling ${funcName}(${step.value})`);
                setNodes(prev=>[...prev,{
                    id:step.id,
                    parentId:step.parentId,
                    value: step.value,
                    result: null
                }
            ]);
                setCurrentStep(prev=>prev+1);
            }
            else if(step.type==="return"){
                setCurrentAction(`Returning ${funcName}(${step.value})=${step.result}`);
                setNodes(prev=>
                   prev.map(node=>
                    node.id===step.id
                    ? {...node,result:step.result}
                    : node
                   )
                );
                setCurrentStep(prev=>prev+1);
            }
        },speed);
        return ()=>clearTimeout(timer);
    },[currentStep,steps,funcName,speed]);
    return(
        <div style={{padding:"20px",fontFamily:"Arial"}}>
            <h1>Recursion Visualizer</h1>
            <textarea
            rows="5"
            cols="40"
            placeholder={`Example: 
                fact(n):
                if n==1 return 1
                return n*fact(n-1)`}
            value={code}
            onChange={(e)=>setCode(e.target.value)}
            />
            <br/><br/>
            <input type="number"
            placeholder="Enter input"
            value={input}
            onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={handleSimulate} style={{
                marginLeft:"10px",
                padding:"8px 15px",
                cursor:"pointer"
                }}
            >
                Simulate
            </button>
            <div style={{ marginTop: "20px" }}>
                <div style={{ marginTop: "10px" }}>
                <label>Speed: </label>
                <input
                    type="range"
                    min="300"
                    max="3000"
                    step="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                />
                <span> {speed} ms</span>
                </div>
                <h3 style={{marginTop:"20px"}}>{currentAction}</h3>
                <div style={{
                    marginTop:"20px",
                    overflowX:"auto",
                    padding:"20px",
                    borderRadius:"12px",
                    backgroundColor:"#f8f9fa",
                    border:"1px solid #ddd"
                    }}
                >
                    {buildTree(nodes).map((root)=>(
                        <TreeNode key={root.id} node={root} funcName={funcName}/>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default App