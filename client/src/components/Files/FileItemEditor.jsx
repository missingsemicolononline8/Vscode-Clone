import { getFileIconClass } from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import { useState } from "react";


const FileItemEditor = ({ depth, name, type, onBlurListener }) => {

    const [nodeName, setNodeName] = useState(name)

    return (
        <div className="flex" style={{ marginLeft: `${(depth * 8) + 20}px` }}>
            <span className={getFileIconClass(nodeName, type === "directory", false)}></span>
            <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} type="text" placeholder='Enter Name' className='outline-none ml-3' autoFocus onBlur={onBlurListener} />
        </div>
    )
}

export default FileItemEditor