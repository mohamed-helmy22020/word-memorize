"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AddNewLanguageDialog from "./AddNewLanguageDialog";

const AddNewLanguage = () => {
    const t = useTranslations("AddNewLanguage");
    const [open, setOpen] = useState(false);

    return (
        <div className="add-new-language hover:opacity-75">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="w-full h-full flex justify-between p-3">
                    {t("AddLanguage")} <PlusIcon />
                </DialogTrigger>
                <DialogContent>
                    <AddNewLanguageDialog setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewLanguage;
