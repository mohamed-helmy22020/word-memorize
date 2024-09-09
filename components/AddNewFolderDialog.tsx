"use client";
import { addNewFolder } from "@/lib/actions/user.actions";
import { useLanguagesStore } from "@/store/userLanguages";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
const AddNewFolderDialog = ({
    setOpen,
    path,
    setFolders,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    path: string;
    setFolders: React.Dispatch<React.SetStateAction<FolderType[]>>;
}) => {
    const { currentLanguage } = useLanguagesStore();
    const [folder, setFolder] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleAddNewFolder = async () => {
        setIsLoading(true);
        if (folder === "") {
            setIsLoading(false);

            return;
        }
        const addedFolder = await addNewFolder(
            folder,
            path,
            currentLanguage.$id
        );
        if (addedFolder.error) {
            setError(addedFolder.error);
            setIsLoading(false);
            return;
        }
        if (addedFolder.success) {
            setFolders((oldState) => {
                return [
                    ...oldState,
                    {
                        $id: addedFolder.newFolder.$id,
                        name: addedFolder.newFolder.name,
                        path: addedFolder.newFolder.path,
                    },
                ];
            });
        }
        setOpen(false);
    };
    return (
        <>
            <DialogHeader>
                <DialogTitle>Add New Folder</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="folder" className="sr-only">
                        New Folder
                    </Label>
                    <Input
                        id="folder"
                        className="focus-visible:ring-transparent"
                        value={folder}
                        placeholder="Folder Name"
                        onChange={(e) => setFolder(e.target.value)}
                    />
                </div>
            </div>
            <div className="text-md text-red-600 font-bold">{error}</div>
            <DialogFooter className="sm:justify-start">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isLoading}
                    onClick={handleAddNewFolder}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            &nbsp;Loading...
                        </>
                    ) : (
                        "Add"
                    )}
                </Button>
            </DialogFooter>
        </>
    );
};

export default AddNewFolderDialog;
