"use client";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { deleteDocument } from "@/lib/actions/user.actions";
import { useLanguagesStore } from "@/store/userLanguagesStore";
import { Volume2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import WordDialog from "./WordDialog";
import WordInfoDialog from "./WordInfoDialog";

const WordCard = ({
    word,
    setWords,
}: {
    word: WordType;
    setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
}) => {
    const { currentLanguage } = useLanguagesStore();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [openWordInfo, setOpenWordInfo] = useState(false);
    const handleListen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(word.secondLang);

        speech.lang = currentLanguage.code;
        speech.rate = 1;
        speechSynthesis.speak(speech);
    };

    const handleDelete = async () => {
        const deleteConfirm = confirm(
            "Are you sure you want to delete this word?",
        );
        if (!deleteConfirm) return;
        const success = await deleteDocument("word", word.$id);
        if (success) {
            setWords((prevWords) =>
                prevWords.filter((w) => w.$id !== word.$id),
            );
        }
    };
    return (
        <>
            <WordInfoDialog
                open={openWordInfo}
                setOpen={setOpenWordInfo}
                word={word}
            />
            <ContextMenu>
                <ContextMenuTrigger>
                    <Dialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                    >
                        <DialogContent>
                            <WordDialog
                                isEdit
                                word={word}
                                setOpen={setEditDialogOpen}
                                setWords={setWords}
                            />
                        </DialogContent>
                    </Dialog>
                    <button onClick={() => setOpenWordInfo(true)}>
                        <div className="data-card">
                            <div className="first-lang">{word.firstLang}</div>
                            <div className="second-lang">{word.secondLang}</div>
                            <div
                                className="flex mt-3 justify-center items-center cursor-pointer"
                                onClick={handleListen}
                            >
                                <div className="">
                                    <Volume2 />
                                </div>
                                <span className="inline-block ml-2 font-semibold text-lg">
                                    Listen
                                </span>
                            </div>
                        </div>
                    </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => setEditDialogOpen(true)}>
                        Edit
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleDelete}>
                        Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
};

export default WordCard;
