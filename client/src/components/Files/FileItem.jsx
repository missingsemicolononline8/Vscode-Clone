import React, { useEffect, useState, useRef } from 'react';
import { useCollapseContext } from '../../context/CollapseContext';
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators } from '../../store'
import { bindActionCreators } from 'redux';
import FileItemEditor from './FileItemEditor';

const FileTreeItem = ({ node, depth = 1 }) => {
    const collapseAll = useCollapseContext();
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (node.type === "directory") { collapseAll.current = [...collapseAll.current, setExpanded] }
    }, [])

    return (
        <div className='filenode'>
            <FileNode {...{ ...node, depth, expanded, setExpanded }} />
            <FileNodeChildren {...{ expanded, depth, parent: node }} />
        </div>
    );
};

export default FileTreeItem;


const FileNode = ({ name, path, type, children, expanded, setExpanded, depth }) => {

    const dispatch = useDispatch();

    const [renaming, setRenaming] = useState(false);
    const currentNode = useRef();

    const { setSelectedNodeDir, openFile } = bindActionCreators(actionCreators, dispatch);

    const handleBlur = () => setRenaming(false)

    const fetchFileContent = async (projectId, filePath) => {
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}/files/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU0MTEwYjVmZjIyNDAzNjU0OTM0ZTA2In0sImlhdCI6MTY5OTAyNzIyNn0.9f8nRlMeYszWDU9gdmSLS5SyC3350qm6b-jJkadGwBY'
            },
            body: JSON.stringify({
                filePath
            })
        });
        const data = await response.json();

        if (response.ok) {
            return data.content;
        } else {
            return 'Error fetching file content';
        }
    }

    const handleClick = async () => {

        setTimeout(() => {
            setSelectedNodeDir(type === "directory" ? path : path.replace("/" + name, ""))
            currentNode.current.classList.add('active')
        }, 10);
        if (type === "directory") { setExpanded(!expanded) } else {

            let content = await fetchFileContent('65412693019a59bd075f084d', path)
            openFile({ name, path, content })

        }

    };

    return renaming ?
        <FileItemEditor {...{ depth, name, type, handleBlur }} />
        :
        <section ref={currentNode} className="node-name relative cursor-pointer  hover:bg-gray-300 " style={{ paddingLeft: `${depth * 8}px` }} onClick={handleClick} >
            {children && <span className='absolute bottom-[2px]'><i className={`fa-solid ${expanded ? 'fa-angle-down' : 'fa-angle-right'}`}></i></span>}
            <FileItemWithFileIcon customClass="ml-5" iconClass="mr-2" treeNode={{ name, type, expanded }} />
        </section>
}


const FileNodeChildren = ({ expanded, parent, depth }) => {

    const dispatch = useDispatch();

    const nodeDIR = useSelector((state) => state.selectedNodeDir)
    const addingNode = useSelector((state) => state.addingFile)
    const newFileType = useSelector((state) => state.newFileType)

    const { setAddingFile } = bindActionCreators(actionCreators, dispatch);
    const handleBlur = () => setAddingFile(false)

    return parent.children && expanded && depth++ && (
        <div className='node-children'>
            {addingNode && nodeDIR === parent.path &&
                <FileItemEditor {...{ depth, handleBlur, name: "", type: newFileType }} />}
            {parent.children.map((childNode) => (
                <FileTreeItem key={JSON.stringify(childNode)} node={childNode} depth={depth} />
            ))}
        </div>
    )
}