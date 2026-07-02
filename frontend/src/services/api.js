const API_URL="http://localhost:5000/api/execute";
export async function visualizeRecursion(code){
    const response=await fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({code}),
    });
    const data=await response.json();
    if(!response.ok || !data.success){
        throw new Error(data.error || "Visualization failed.");
    }
    return data;
}