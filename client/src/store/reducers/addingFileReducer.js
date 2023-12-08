const setAddingFile = (state=false,action) => 
{
    if(action.type == "addingFile") {
        return action.payload;
    }

    else 
    return state
}

const setNewFileType = (state=null,action) => {
    if(action.type == "newFileType") {
        return action.payload
    }
    else return state;
}

export default {setAddingFile,setNewFileType}