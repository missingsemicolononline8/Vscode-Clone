import selectedNodeDirReducer from "./selectedNodeDirectoryReducer"
import addingFileReducer from "./addingFileReducer";
import openedFilesReducer from './openedFilesReducer';

import { combineReducers } from "redux";

const reducers = combineReducers({
    selectedNodeDir : selectedNodeDirReducer.setSelectedNodeDir,
    addingFile: addingFileReducer.setAddingFile,
    newFileType:addingFileReducer.setNewFileType,
    openedFiles: openedFilesReducer
})

export default reducers;