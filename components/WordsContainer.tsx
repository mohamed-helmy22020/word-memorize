"use client";
import AddNewWord from "./AddNewWord";
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
    return (
        <div className="words-container">
            <div className="font-semibold mb-2">Words</div>
            <div className="flex flex-wrap flex-1  gap-3">
                {words.map((w) => {
                    return (
                        <WordCard
                            key={w.$id}
                            firstLang={w.firstLang}
                            secondLang={w.secondLang}
                        />
                    );
                })}
            </div>
            <AddNewWord path={path} setWords={setWords} />
        </div>
    );
};

export default WordsContainer;
