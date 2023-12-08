const setSelectedNodeDir = (state='../backend',action) => 
{
    if(action.type == "selectedNodeDir") {
        return action.payload;
    }

    else 
    return state
}

export default {setSelectedNodeDir}