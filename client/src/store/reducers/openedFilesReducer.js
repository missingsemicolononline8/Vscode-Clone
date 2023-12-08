
const openedFilesReducer = (state={tabs:[],activeTab:0},action) => {
    if(action.type === "openFile") {
        let exists = state.tabs.findIndex((element) =>  {  // Check if the file is already opened
           return element.path === action.payload.path
        })

        return exists !== -1 ? {   // If file is already opened, switch to correct tab 
            ...state,
            activeTab: exists
        } : {                     // else if file is not already open, open it & switch to its tab 
            tabs: [
                ...state.tabs,
                action.payload
            ],
            activeTab : state.tabs.length
        }
    }
    else if(action.type === "closeFile") {
        return {
            tabs: state.tabs.filter((file,idx) => idx !== action.payload),
            activeTab: action.payload > 0 ? action.payload - 1: action.payload
        }   
    }

    else if (action.type==="switchTab") {
        return {
            ...state,
            activeTab:action.payload
        }
    }
    else {
        return state
    }
}

export default openedFilesReducer;