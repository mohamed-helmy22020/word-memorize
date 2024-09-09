"use client";
import Link from "next/link";
import AddNewFolder from "./AddNewFolder";
import Folder from "./Folder";

const FoldersContainer = ({
    folders,
    path,
    setFolders,
}: {
    folders: FolderType[];
    path: string;
    setFolders: React.Dispatch<React.SetStateAction<FolderType[]>>;
}) => {
    return (
        <div className="folders-container">
            <div className="font-semibold mb-2">Folders</div>
            <div className="flex flex-wrap flex-1  gap-3">
                {folders.map((f) => {
                    const folderHref = `${f.path}${f.name
                        .trim()
                        .replace(" ", "-")}`;
                    return (
                        <Link href={folderHref} key={f.$id}>
                            <Folder name={f.name} />
                        </Link>
                    );
                })}
            </div>
            <AddNewFolder path={path} setFolders={setFolders} />
        </div>
    );
};

export default FoldersContainer;
