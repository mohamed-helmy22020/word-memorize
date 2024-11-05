import Link from "next/link";
import React from "react";
import WordCard from "./WordCard";

type Props = {
    words: WordType[];
    setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
};

const WordsWithPath = ({ words, setWords }: Props) => {
    let i = -1;
    let lastPath = "";
    const newWordsArray: WordType[][] = [];
    words.forEach((word) => {
        if (word.path !== lastPath) {
            i++;
            lastPath = word.path;
            newWordsArray.push([]);
        }
        newWordsArray[i].push(word);
    });

    return (
        <div className="flex flex-col gap-5">
            {newWordsArray.map((wordsGroup, i) => (
                <React.Fragment key={i}>
                    <div className="text-2xl font-bold">
                        <Link href={wordsGroup[0].path}>
                            {wordsGroup[0].path.replaceAll("-", " ")}
                        </Link>
                    </div>
                    <div className="flex flex-wrap flex-1  gap-3">
                        {wordsGroup.map((w) => {
                            return (
                                <WordCard
                                    setWords={setWords}
                                    key={w.$id}
                                    word={w}
                                />
                            );
                        })}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};
export default WordsWithPath;
