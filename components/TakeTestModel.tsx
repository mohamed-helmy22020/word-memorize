import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { getTestWords } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import { usePathNameStore } from "@/store/pathnameStore";
import { useTakeTestsStore } from "@/store/takeTestsStore";
import { useLanguagesStore } from "@/store/userLanguagesStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ID } from "node-appwrite";
import { useEffect, useState } from "react";
import CustomSwitch from "./CustomSwitch";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
type Props = {};

const TakeTest = ({}: Props) => {
    const router = useRouter();

    const [isModelOpen, setIsModelOpen] = useState<boolean>(true);
    const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);
    const [isTestLoading, setIsTestLoading] = useState<boolean>(false);
    const [includeSubdirs, setIncludeSubdirs] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [words, setWords] = useState<WordTestType[]>([]);
    const [showItems, setShowItems] = useState({
        firstLang: false,
        secondLang: false,
        voice: false,
    });

    const currentLanguage = useLanguagesStore((state) => state.currentLanguage);
    const path = usePathNameStore((state) => state.pathName);
    const addTest = useTakeTestsStore((state) => state.addTest);

    const handleShowItemsChange = (
        id: string,
        checked: boolean | "indeterminate"
    ) => {
        setShowItems((prev) => ({ ...prev, [id]: checked }));
    };

    const handleTakeTest = async () => {
        setError("");
        setIsTestLoading(true);
        if (!showItems.firstLang && !showItems.secondLang && !showItems.voice) {
            setError("You should choose at least one item");
            setIsTestLoading(false);

            return;
        }
        if (showItems.firstLang == true && showItems.secondLang == true) {
            setError(
                "You can't choose first and second language at the same time"
            );
            setIsTestLoading(false);
            return;
        }
        if (words.length === 0) {
            setError("There is no words in this folder");
            setIsTestLoading(false);
            return;
        }
        const id = ID.unique();
        addTest({
            id,
            isFinished: false,
            path,
            score: 0,
            wordsLength: words.length,
            date: new Date().getTime(),
            includeSubdirs,
            showItems,
            words,
        });
        router.push(`/take_test?testId=${id}`);
    };
    useEffect(() => {
        const getWords = async () => {
            setIsFetchLoading(true);
            const testWords = await getTestWords(
                currentLanguage.$id,
                path,
                includeSubdirs
            );
            setWords(testWords);
            setIsFetchLoading(false);
        };
        if (isModelOpen) {
            getWords();
        }
    }, [includeSubdirs, isModelOpen, currentLanguage.$id, path]);
    return (
        <Dialog modal={isModelOpen} onOpenChange={setIsModelOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="mr-5">
                    Take Test
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Take Test</DialogTitle>
                </DialogHeader>
                <hr className="border border-gray-500" />
                <div className="flex items-center gap-3">
                    <CustomSwitch
                        title="Include subdirectories"
                        checked={includeSubdirs}
                        onCheckedChange={setIncludeSubdirs}
                        disabled={isFetchLoading}
                    />

                    {isFetchLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <div className="text-xl">
                            <span
                                className={cn(
                                    words.length === 0 && "text-red-500"
                                )}
                            >
                                {words.length.toString()}
                            </span>{" "}
                            Words
                        </div>
                    )}
                </div>
                <hr className="border border-gray-500" />
                <h2 className="font-semibold text-lg">Show</h2>
                <div className="flex justify-start items-center gap-3">
                    <div
                        className={cn(
                            "flex gap-3 justify-center items-center ",
                            showItems.secondLang && "line-through"
                        )}
                    >
                        <label htmlFor="firstLang">First Language</label>
                        <Checkbox
                            id="firstLang"
                            name="showItems"
                            checked={showItems.firstLang}
                            onCheckedChange={(checked) => {
                                handleShowItemsChange("firstLang", checked);
                            }}
                            disabled={showItems.secondLang}
                        />
                    </div>

                    <div
                        className={cn(
                            "flex gap-3 justify-center items-center ",
                            showItems.firstLang && "line-through"
                        )}
                    >
                        <label htmlFor="secondLang">Second Language</label>
                        <Checkbox
                            id="secondLang"
                            name="showItems"
                            checked={showItems.secondLang}
                            onCheckedChange={(checked) => {
                                handleShowItemsChange("secondLang", checked);
                            }}
                            disabled={showItems.firstLang}
                        />
                    </div>

                    <div className="flex gap-3 justify-center items-center">
                        <label htmlFor="voice">Voice</label>
                        <Checkbox
                            id="voice"
                            name="showItems"
                            checked={showItems.voice}
                            onCheckedChange={(checked) => {
                                handleShowItemsChange("voice", checked);
                            }}
                        />
                    </div>
                </div>
                <div className="text-red-600 text-xl text-center">{error}</div>
                <div className="flex justify-center items-center">
                    <Button
                        size="lg"
                        className="text-white bg-green-800 hover:bg-green-700"
                        onClick={handleTakeTest}
                        disabled={isTestLoading || isFetchLoading}
                    >
                        {isTestLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                &nbsp;Loading...
                            </>
                        ) : (
                            "Start"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TakeTest;
