"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import FolderDialog from "./FolderDialog";

const AddNewFolder = ({
    path,
    setFolders,
}: {
    path: string;
    setFolders: React.Dispatch<React.SetStateAction<FolderType[]>>;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="add-new-folder hover:opacity-75">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="w-full h-full flex justify-between p-3">
                    Add Folder <PlusIcon />
                </DialogTrigger>
                <DialogContent>
                    <FolderDialog
                        setOpen={setOpen}
                        path={path}
                        setFolders={setFolders}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewFolder;
