"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import WordDialog from "./WordDialog";

const AddNewWord = ({
    setWords,
}: {
    setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="add-new-folder hover:opacity-75">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="w-full h-full flex justify-between p-3">
                    Add Word <PlusIcon />
                </DialogTrigger>
                <DialogContent>
                    <WordDialog setOpen={setOpen} setWords={setWords} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewWord;
