import React, { useState } from 'react'
import Editor from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../store';



const CodeEditor = () => {
    const { tabs, activeTab } = useSelector(state => state.openedFiles);
    const [monacoInstance, setMonacoInstance] = useState();

    function onEditorWillMount(monaco) {
        setMonacoInstance(monaco);
    }

    function traverseTree() {
        const tree = monacoInstance.editor.getModel().fileTree;

        for (const root of tree.roots) {
            console.log(root);
        }

        // Recursively walk tree
        walk(tree);
    }

    function walk(tree, parentURI) {
        for (const [nodeURI, node] of tree.getNode(parentURI).children) {
            console.log(nodeURI);
            walk(tree, nodeURI); // Walk recursively
        }
    }



    const handleEditorChange = (value, event) => {
        console.log(value, event)
    }
    return (
        <main className='flex-1 resize-x overflow-x-auto'>
            <Tabs {...{ tabs, activeTab }} />
            <Editor beforeMount={onEditorWillMount} onChange={handleEditorChange} theme="vs-dark" path={tabs.at(activeTab)?.path} defaultValue={tabs.at(activeTab)?.content} height="94vh" />
            <button onClick={traverseTree}>Log File Tree</button>
        </main>
    )
}

export default CodeEditor;

const Tabs = ({ tabs, activeTab }) => {
    const dispatch = useDispatch();
    const { closeFile, switchTab } = bindActionCreators(actionCreators, dispatch);


    return (
        <div className="tabs bg-black bg-opacity-90 h-10">
            <div className="tabs-wrapper text-w">
                {tabs.map((tab, index) => <Tab key={index} active={index === activeTab} title={tab.name} handleClick={() => switchTab(index)} handleClose={(e) => { e.stopPropagation(); closeFile(index) }} />)}
            </div>
        </div>
    )
}

const Tab = ({ active, title, handleClick, handleClose }) => {

    return (
        <div id={active && "activeTab"} onClick={handleClick} className="group tab px-3 py-2 pr-12 hover:bg-zinc-800 inline-flex border-gray-700 border-t-transparent border-r-[1px] border-b-[1px] border-t-2 focus: relative cursor-pointer h-full">
            <FileItemWithFileIcon customClass={'text-white'} iconClass="mr-2" treeNode={{ name: title, type: "file", expanded: false }} />
            <i onClick={handleClose} className="fas fa-close text-[15px] leading-none px-1 py-[3px] rounded-sm text-gray-400 absolute top-[10px] right-2 hover:bg-gray-700 hidden group-hover:block"></i>
        </div>
    )
}