import { deleteDocument } from "@/lib/actions/user.actions";
import { Folder as FolderIcon } from "lucide-react";
import Link from "next/link";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "./ui/context-menu";
const Folder = ({
    folder,
    setFolders,
    folderHref,
}: {
    folder: FolderType;
    setFolders: React.Dispatch<React.SetStateAction<FolderType[]>>;
    folderHref: string;
}) => {
    const handleDelete = async () => {
        const deleteConfirm = confirm(
            "Are you sure you want to delete this folder and all its words?",
        );
        if (!deleteConfirm) return;
        const success = await deleteDocument("folder", folder.$id);
        if (success) {
            setFolders((prevFolders) =>
                prevFolders.filter((f) => f.$id !== folder.$id),
            );
        }
    };
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Link href={folderHref}>
                    <div className="folder" title={folder.name}>
                        <div className="icon">
                            <FolderIcon
                                fill="rgb(255,255,255,0.6)"
                                color="rgb(255,255,255,0.6)"
                            />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {folder.name}
                        </div>
                    </div>
                </Link>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default Folder;
