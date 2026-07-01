function buildTree(events){
    const nodes={};
    let root=null;
    for(const event of events){
        if(event.type==="CALL"){
            nodes[event.id]={
                id:event.id,
                parent:event.parent,
                args:event.args,
                returnValue:null,
                children:[]
            };
            if(event.parent===-1){
                root=event.id;
            }else{
                nodes[event.parent].children.push(event.id);
            }
        }
        else if(event.type==="RETURN"){
            if(nodes[event.id]){
                nodes[event.id].returnValue=event.value;
            }
        }
    }
    return{
        root,
        nodes
    };
}
module.exports=buildTree;