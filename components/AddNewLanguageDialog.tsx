import { useLanguagesStore } from "@/store/userLanguages";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
const AddNewLanguageDialog = ({
    setOpen,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { addNewLanguage } = useLanguagesStore();
    const [lang, setLang] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleAddNewLang = async () => {
        setIsLoading(true);
        await addNewLanguage(lang);
        setOpen(false);
    };
    return (
        <>
            <DialogHeader>
                <DialogTitle>Add New Language</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="language" className="sr-only">
                        Language
                    </Label>
                    <Input
                        id="language"
                        className="focus-visible:ring-transparent"
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                    />
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
                        "Add"
                    )}
                </Button>
            </DialogFooter>
        </>
    );
};

export default AddNewLanguageDialog;
