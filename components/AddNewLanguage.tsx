import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import AddNewLanguageDialog from "./AddNewLanguageDialog";

const AddNewLanguage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="add-new-language hover:opacity-75">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="w-full h-full flex justify-between p-3">
                    Add Language <PlusIcon />
                </DialogTrigger>
                <DialogContent>
                    <AddNewLanguageDialog setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewLanguage;
