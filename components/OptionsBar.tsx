import CustomSwitch from "./CustomSwitch";
import TakeTest from "./TakeTestModel";

type OptionsBarProps = {
    showAllWords: boolean;
    showPaths: boolean;
    words: WordType[];
    setShowAllWords: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPaths: React.Dispatch<React.SetStateAction<boolean>>;
};
const OptionsBar = ({
    showAllWords,
    showPaths,
    setShowAllWords,
    setShowPaths,
    words,
}: OptionsBarProps) => {
    return (
        <div className="flex justify-between w-full bg-slate-700 py-2 px-5  rounded-full">
            <div className="flex w-3/5 gap-5">
                <CustomSwitch
                    title="Show all words"
                    id="showAllWords"
                    checked={showAllWords}
                    onCheckedChange={() => {
                        setShowAllWords((prev) => !prev);
                    }}
                />
                {showAllWords && (
                    <CustomSwitch
                        title="Show Paths"
                        id="ShowPaths"
                        checked={showPaths}
                        onCheckedChange={() => setShowPaths((prev) => !prev)}
                    />
                )}
            </div>

            <div className="flex w-2/5 justify-end items-center">
                <TakeTest />
            </div>
        </div>
    );
};

export default OptionsBar;
