"use client";
import {
    addNewWord,
    editDocument,
    getLoggedInUser,
} from "@/lib/actions/user.actions";
import { usePathNameStore } from "@/store/pathnameStore";
import { useLanguagesStore } from "@/store/userLanguagesStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
const WordDialog = ({
    setOpen,
    setWords,
    isEdit,
    word,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
    isEdit?: boolean;
    word?: WordType;
}) => {
    const { currentLanguage } = useLanguagesStore();
    const [firstLang, setFirstLang] = useState(word ? word.firstLang : "");
    const [secondLang, setSecondLang] = useState(word ? word.secondLang : "");
    const [desc, setDesc] = useState(word?.desc ? word.desc : "");
    const [isLoading, setIsLoading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<User | null>(null);
    console.log({ user });

    const { pathName: path } = usePathNameStore();

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const user = await getLoggedInUser();
                setUser(user);
            } catch (error) {
                console.log(error);
            }
        };
        getUserInfo();
    }, []);

    const handleGenerateDesc = async () => {
        if (secondLang.trim() === "") {
            setError("Please enter a word to generate description");
            return;
        }
        setDesc("");
        setError("");
        setIsGenerating(true);
        try {
            const res = await fetch(`/api/generate-desc?word=${secondLang}`, {
                method: "GET",
            });
            const data = await res.text();
            if (!res.ok) {
                throw setError(data);
            }
            setDesc(data);
        } catch (error: any) {
            console.log(error);
        }
        setIsGenerating(false);
    };

    const handleTranslate = async () => {
        if (secondLang.trim() === "") {
            setError("Please enter a word to translate");
            return;
        }
        setIsTranslating(true);
        try {
            const res = await fetch(
                `/api/translate/${user?.translationType === "ai" ? "ai/" : ""}?sentence=${secondLang}&sl=${currentLanguage.code}&tl=ar`,
                {
                    method: "GET",
                },
            );
            const data = await res.text();
            if (!res.ok) {
                throw setError(data);
            }
            setFirstLang(data);
        } catch (error: any) {
            console.log(error);
        }
        setIsTranslating(false);
    };

    const handleAddNewWord = async () => {
        setIsLoading(true);

        if (firstLang.trim() === "" || secondLang.trim() === "") {
            setIsLoading(false);
            setError("Please enter a word");
            return;
        }
        if (isEdit) {
            const editedWord = await editDocument("word", word?.$id!, {
                firstLang,
                secondLang,
                desc,
            });
            if (!editedWord.success) {
                setError(editedWord.error!);
                setIsLoading(false);
                return;
            }
            if (editedWord.success) {
                setWords((prev) => {
                    return prev.map((w) => {
                        if (w.$id === word?.$id) {
                            return {
                                ...w,
                                ...editedWord.data,
                            };
                        }
                        return w;
                    });
                });
            }
            setOpen(false);

            return;
        }

        const addedWord = await addNewWord(
            firstLang,
            secondLang,
            desc,
            path!,
            currentLanguage.$id,
        );
        if (addedWord.error) {
            setError(addedWord.error);
            setIsLoading(false);
            return;
        }
        if (addedWord.success && addedWord.newWord) {
            setWords((prev) => [...prev, addedWord.newWord]);
        }
        setOpen(false);
    };
    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    {isEdit ? "Edit Word" : "Add New Word"}
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 items-center space-x-2">
                <div className="relative grid flex-1 gap-2 w-full">
                    <Label htmlFor="first-lang" className="sr-only">
                        First Language
                    </Label>
                    <Input
                        id="first-lang"
                        className="focus-visible:ring-transparent"
                        value={firstLang}
                        placeholder="First Language"
                        onChange={(e) => setFirstLang(e.target.value)}
                        onBlur={(e) => setFirstLang(e.target.value.trim())}
                    />
                </div>
                <div className="relative grid flex-1 gap-2  w-full">
                    <Label htmlFor="second-lang" className="sr-only">
                        Second Language
                    </Label>
                    <Input
                        id="second-lang"
                        className="focus-visible:ring-transparent"
                        value={secondLang}
                        placeholder="Second Language"
                        onChange={(e) => setSecondLang(e.target.value)}
                        onBlur={(e) => setSecondLang(e.target.value.trim())}
                    />
                    <div className="absolute end-0">
                        <Button
                            variant={"outline"}
                            onClick={handleTranslate}
                            disabled={isTranslating}
                        >
                            {isTranslating ? "Translating..." : "Translate"}
                        </Button>
                    </div>
                </div>
                <div className="relative grid flex-1 gap-2 w-full">
                    <Label htmlFor="first-lang" className="sr-only">
                        Description
                    </Label>
                    <Textarea
                        id="desc"
                        className="focus-visible:ring-transparent"
                        value={desc}
                        placeholder="Description"
                        onChange={(e) => setDesc(e.target.value)}
                        onBlur={(e) => setDesc(e.target.value.trim())}
                    />
                    <div className="absolute end-2 bottom-2">
                        <Button
                            variant={"outline"}
                            onClick={handleGenerateDesc}
                            disabled={isGenerating}
                            className="text-xs p-1"
                        >
                            {isGenerating
                                ? "Generating..."
                                : "Generate with AI"}
                        </Button>
                    </div>
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
                    ) : isEdit ? (
                        "Edit"
                    ) : (
                        "Add"
                    )}
                </Button>
            </DialogFooter>
        </>
    );
};

export default WordDialog;
