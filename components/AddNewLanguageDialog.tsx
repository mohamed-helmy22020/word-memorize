"use client";
import { useLanguagesStore } from "@/store/userLanguages";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import LanguageSelect from "./LanguageSelect";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
const AddNewLanguageDialog = ({
    setOpen,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const t = useTranslations("AddNewLanguageDialog");
    const { addNewLanguage } = useLanguagesStore();
    const [lang, setLang] = useState({
        name: "",
        code: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleAddNewLang = async () => {
        setIsLoading(true);
        if (lang.name === "" || lang.code === "") {
            setIsLoading(false);

            return;
        }
        await addNewLanguage(lang);
        setOpen(false);
    };
    return (
        <>
            <DialogHeader>
                <DialogTitle>{t("AddNewLanguage")}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="language" className="sr-only">
                        {t("Language")}
                    </Label>
                    <LanguageSelect lang={lang} setLang={setLang} />
                </div>
            </div>
            <DialogFooter className="sm:justify-start">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isLoading}
                    onClick={handleAddNewLang}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            &nbsp;Loading...
                        </>
                    ) : (
                        t("Add")
                    )}
                </Button>
            </DialogFooter>
        </>
    );
};

export default AddNewLanguageDialog;
