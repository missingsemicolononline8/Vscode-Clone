
export const setSelectedNodeDir = (nodeDir) => {
    return (dispatch) => {
        dispatch({
            type: 'selectedNodeDir',
            payload: nodeDir
        })
    }
}

export const setAddingFile = (value) => {
    return (dispatch) => {
        dispatch({
            type: 'addingFile',
            payload: value
        })
    }
}


export const setNewFileType = (value) => {
    return (dispatch) => {
        dispatch({
            type: 'newFileType',
            payload: value
        })
    }
}

export const openFile = (value) => {
    return (dispatch) => {
        dispatch({
            type:'openFile',
            payload:value
        })
    }
}

export const switchTab = (value) => {
    return (dispatch) => {
        dispatch({
            type:'switchTab',
            payload:value
        })
    }
}

export const closeFile = (index) => {
    return (dispatch) => {
        dispatch({
            type:'closeFile',
            payload:index
        })
    }
}