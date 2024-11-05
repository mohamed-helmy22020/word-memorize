"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import AddNewWord from "./AddNewWord";
import { Badge } from "./ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import WordCard from "./WordCard";
import WordsWithPath from "./WordsWithPath";

const WordsContainer = ({
    words,
    setWords,
    showPaths,
    showAllWords,
}: {
    words: WordType[];
    setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
    showPaths: boolean;
    showAllWords: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="words-container">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger>
                    <div className="flex justify-center items-center font-semibold mb-2  gap-2 hover:bg-slate-400 rounded-sm p-1 pr-2">
                        {isOpen ? <ChevronDown /> : <ChevronRight />} Words
                        <Badge variant="default">{words.length}</Badge>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                    {showPaths && showAllWords ? (
                        <WordsWithPath words={words} setWords={setWords} />
                    ) : (
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
                    )}
                </CollapsibleContent>
                <AddNewWord setWords={setWords} />
            </Collapsible>
        </div>
    );
};

export default WordsContainer;
