import Link from "next/link";
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
                <>
                    <div className="text-2xl font-bold">
                        <Link href={wordsGroup[0].path}>
                            {wordsGroup[0].path}
                        </Link>
                    </div>
                    <div className="flex flex-wrap flex-1  gap-3" key={i}>
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
                </>
            ))}
        </div>
    );
};
export default WordsWithPath;
