import React, { useEffect, useState, useRef } from 'react'
import { CollapseProvider, useCollapseContext } from '../../context/CollapseContext';
import FileItem from './FileItem'
import { addFile, addFolder, refreshFiles, collapse } from '../../assets'
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../../store'
import { bindActionCreators } from 'redux';
import FileItemEditor from './FileItemEditor';
import '@sinm/react-file-tree/icons.css';


const ProjectFiles = () => {

    const dispatch = useDispatch();
    const { setSelectedNodeDir } = bindActionCreators(actionCreators, dispatch);

    const [projectFiles, setProjectFiles] = useState();
    const collapseAll = useRef([]);

    const loadTree = async () => {
        let jsonTree = await import('../../../tree_new.json')
        return jsonTree
    }

    useEffect(() => {
        (async () => {
            const fileStructure = await loadTree();
            setProjectFiles(fileStructure)
            setSelectedNodeDir(fileStructure.path)
        })()
    }, [])

    return (
        <CollapseProvider collapseAll={collapseAll}>
            <aside tabIndex={0} className='files min-w-[180px] overflow-x-auto resize-x w-2/12 pr-0 inline-block h-screen group'>
                <div className='flex flex-col h-full'>
                    <span className='pl-4 pt-3 pb-2 text-sm'>EXPLORER</span>
                    <ProjectInfo name={projectFiles?.name} setDefaultPath={() => setSelectedNodeDir(projectFiles.path)} />
                    <FileTreeView firstNode={projectFiles} />
                </div>
            </aside>
        </CollapseProvider>
    )
}

export default ProjectFiles;

const ProjectInfo = ({ name, setDefaultPath }) => {
    return <div className="project-info flex justify-between items-center p-2 pl-4 pt-0">
        <div className='project-title '>{name}</div>
        <FileActions setDefaultPath={setDefaultPath} />
    </div>;
}

const FileActions = ({ setDefaultPath }) => {

    const dispatch = useDispatch();
    const { setNewFileType, setAddingFile } = bindActionCreators(actionCreators, dispatch);
    const collapseAll = useCollapseContext();

    const addNewFile = () => {
        setNewFileType('file')
        setAddingFile(true)
    }

    const addNewFolder = () => {
        setNewFileType('directory')
        setAddingFile(true)
    }

    const collapseTree = () => {
        collapseAll.current.forEach((modifier) => {
            modifier(false)
        })
        setDefaultPath()
    }

    return (
        <div className="actions hidden group-hover:flex gap-2 ">
            <button onClick={addNewFile}>
                <img src={addFile} className='w-5' />
            </button>
            <button onClick={addNewFolder}>
                <img src={addFolder} alt="" className="w-5" />
            </button>
            <button>
                <img src={refreshFiles} alt="" className="w-4" />
            </button>
            <button onClick={collapseTree}>
                <img src={collapse} alt="" className="w-4" />
            </button>
        </div>
    )
}

const FileTreeView = ({ firstNode }) => {

    const dispatch = useDispatch();
    const { setSelectedNodeDir, setAddingFile } = bindActionCreators(actionCreators, dispatch);

    const addingNode = useSelector((state) => state.addingFile);
    const nodeDIR = useSelector((state) => state.selectedNodeDir);
    const newFileType = useSelector((state) => state.newFileType)

    const handleClick = () => {
        document.querySelectorAll('.files .active').forEach(el => el.classList.remove('active'))
        setSelectedNodeDir(firstNode.path)
    }

    const handleNewFileInputBlur = () => {
        setAddingFile(false)
    }

    return (
        <div className='filetree flex-grow scrollbar-thin hover:scrollbar-thumb-[#777777]' onClick={handleClick}>
            {/* Adding New Node */}
            {addingNode && nodeDIR === firstNode?.path &&
                <FileItemEditor depth={1} name="" type={newFileType} onBlurListener={handleNewFileInputBlur} />}
            {firstNode?.children.map((node) => (
                <FileItem key={JSON.stringify(node)} {...{ node }} />
            ))
            }
        </div>
    )
}



