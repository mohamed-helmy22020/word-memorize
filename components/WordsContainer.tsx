"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import AddNewWord from "./AddNewWord";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import WordCard from "./WordCard";

const WordsContainer = ({
    words,
    path,
    setWords,
}: {
    words: WordType[];
    path: string;
    setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
}) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="words-container">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger>
                    <div className="font-semibold mb-2 flex gap-2 hover:bg-slate-400 rounded-sm p-1 pr-2">
                        {isOpen ? <ChevronDown /> : <ChevronRight />} Words
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                    <div className="flex flex-wrap flex-1  gap-3">
                        {words.map((w) => {
                            return (
                                <WordCard
                                    setWords={setWords}
                                    key={w.$id}
                                    word={w}
                                />
                            );
                        })}
                    </div>
                </CollapsibleContent>
                <AddNewWord path={path} setWords={setWords} />
            </Collapsible>
        </div>
    );
};

export default WordsContainer;
