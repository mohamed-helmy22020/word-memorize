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
import WordDialog from "./WordDialog";
import { Dialog, DialogContent } from "./ui/dialog";

const WordCard = ({
    word,
    setWords,
}: {
    word: WordType;
    setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
}) => {
    const { currentLanguage } = useLanguagesStore();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const handleListen = () => {
        const speech = new SpeechSynthesisUtterance(word.secondLang);

        speech.lang = currentLanguage.code;
        speech.rate = 0.8;
        speechSynthesis.speak(speech);
    };

    const handleDelete = async () => {
        const deleteConfirm = confirm(
            "Are you sure you want to delete this word?"
        );
        if (!deleteConfirm) return;
        const success = await deleteDocument("word", word.$id);
        if (success) {
            setWords((prevWords) =>
                prevWords.filter((w) => w.$id !== word.$id)
            );
        }
    };
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <WordDialog
                            isEdit
                            word={word}
                            setOpen={setEditDialogOpen}
                            setWords={setWords}
                        />
                    </DialogContent>
                </Dialog>
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
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => setEditDialogOpen(true)}>
                    Edit
                </ContextMenuItem>
                <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default WordCard;
