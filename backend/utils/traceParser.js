function parseTrace(output){
    const events=[];
    const lines=output.trim().split("\n");
    for (const line of lines){
        const tokens=line.trim().split(/\s+/);
        if(tokens.length===0)
            continue;

        if(tokens[0]==="CALL"){
            const id=Number(tokens[1]);
            const parent=Number(tokens[2]);
            const args=tokens.slice(3).map(Number);
            events.push({
                type:"CALL",
                id,
                parent,
                args
            });
        }
        else if(tokens[0]==="RETURN"){
            events.push({
                type:"RETURN",
                id:Number(tokens[1]),
                value:Number(tokens[2])
            });
        }
        
    }
    return events;
}
module.exports=parseTrace;