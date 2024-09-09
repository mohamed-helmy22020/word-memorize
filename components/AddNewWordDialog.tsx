"use client";
import { addNewWord } from "@/lib/actions/user.actions";
import { useLanguagesStore } from "@/store/userLanguages";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
const AddNewWordDialog = ({
    setOpen,
    path,
    setWords,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    path: string;
    setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
}) => {
    const { currentLanguage } = useLanguagesStore();
    const [firstLang, setFirstLang] = useState("");
    const [secondLang, setSecondLang] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleAddNewWord = async () => {
        setIsLoading(true);
        if (firstLang.trim() === "" || secondLang.trim() === "") {
            setIsLoading(false);
            setError("Please enter word");
            return;
        }
        const addedWord = await addNewWord(
            firstLang,
            secondLang,
            path,
            currentLanguage.$id
        );
        console.log(addNewWord);
        if (addedWord.error) {
            setError(addedWord.error);
            setIsLoading(false);
            return;
        }
        if (addedWord.success) {
            setWords((prev) => [...prev, addedWord.newWord]);
        }
        setOpen(false);
    };
    return (
        <>
            <DialogHeader>
                <DialogTitle>Add New Word</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 items-center space-x-2">
                <div className="grid flex-1 gap-2 w-full">
                    <Label htmlFor="first-lang" className="sr-only">
                        First Language
                    </Label>
                    <Input
                        id="first-lang"
                        className="focus-visible:ring-transparent"
                        value={firstLang}
                        placeholder="First Language"
                        onChange={(e) => setFirstLang(e.target.value.trim())}
                    />
                </div>
                <div className="grid flex-1 gap-2  w-full">
                    <Label htmlFor="second-lang" className="sr-only">
                        Second Language
                    </Label>
                    <Input
                        id="second-lang"
                        className="focus-visible:ring-transparent"
                        value={secondLang}
                        placeholder="Second Language"
                        onChange={(e) => setSecondLang(e.target.value.trim())}
                    />
                </div>
            </div>
            <div className="text-md text-red-600 font-bold">{error}</div>
            <DialogFooter className="sm:justify-start">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isLoading}
                    onClick={handleAddNewWord}
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

export default AddNewWordDialog;
