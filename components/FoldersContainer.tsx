"use client";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import AddNewFolder from "./AddNewFolder";
import Folder from "./Folder";
import { Badge } from "./ui/badge";

const FoldersContainer = ({
    folders,
    path,
    setFolders,
}: {
    folders: FolderType[];
    path: string;
    setFolders: React.Dispatch<React.SetStateAction<FolderType[]>>;
}) => {
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true);
    return (
        <div className="folders-container">
            <Collapsible
                open={isCollapsibleOpen}
                onOpenChange={setIsCollapsibleOpen}
            >
                <CollapsibleTrigger>
                    <div className="font-semibold mb-2 flex gap-2 hover:bg-slate-400 rounded-sm p-1 pr-2">
                        {isCollapsibleOpen ? <ChevronDown /> : <ChevronRight />}{" "}
                        Folders<Badge variant="default">{folders.length}</Badge>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                    <div className="flex flex-wrap flex-1  gap-3">
                        {folders.map((f) => {
                            const folderHref = `${f.path}${f.name
                                .trim()
                                .replaceAll(" ", "-")}`;
                            return (
                                <Folder
                                    key={f.$id}
                                    folder={f}
                                    setFolders={setFolders}
                                    folderHref={folderHref}
                                />
                            );
                        })}
                    </div>
                </CollapsibleContent>
                <AddNewFolder path={path} setFolders={setFolders} />
            </Collapsible>
        </div>
    );
};

export default FoldersContainer;
