import { Folder as FolderIcon } from "lucide-react";
const Folder = ({ name }: FolderProps) => {
    return (
        <div className="folder" title={name}>
            <div className="icon">
                <FolderIcon
                    fill="rgb(255,255,255,0.6)"
                    color="rgb(255,255,255,0.6)"
                />
            </div>
            <div className="flex-1 overflow-hidden">{name}</div>
        </div>
    );
};

export default Folder;
