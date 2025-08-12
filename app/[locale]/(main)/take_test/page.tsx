"use client";

import LoadingComponent from "@/components/LoadingComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTakeTestsStore } from "@/store/takeTestsStore";
import { useLanguagesStore } from "@/store/userLanguagesStore";
import { AnimatePresence, motion, useWillChange } from "framer-motion";
import { ChevronLeft, ChevronRight, MoveLeft, Volume2 } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TakeTestPage = () => {
    const willChange = useWillChange();
    const router = useRouter();

    const testId = useSearchParams()?.get("testId");
    const [tests, currentTest, finishTest, setTestWord] = useTakeTestsStore(
        (state) => [
            state.tests,
            state.tests?.find((test) => test.id === testId),
            state.finishTest,
            state.setTestWord,
        ]
    );
    const testWords = currentTest?.words;
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const currentLanguage = useLanguagesStore((state) => state.currentLanguage);
    const [answer, setAnswer] = useState<string>("");

    useEffect(() => {
        setAnswer(testWords?.[currentWordIndex].answer || "");
    }, [testWords, currentWordIndex]);

    const handleSubmit = () => {
        if (answer.trim() === "") return;
        if (!testWords) return;
        const isCorrect = answer === testWords[currentWordIndex]?.secondLang;
        setTestWord(
            testWords[currentWordIndex]?.$id,
            {
                ...testWords[currentWordIndex],
                isCorrect,
                isSolved: true,
                answer: answer.trim(),
            },
            currentTest?.id
        );
        setCurrentWordIndex((prev) => Math.min(prev + 1, testWords.length - 1));
    };

    useEffect(() => {
        console.log({ testWords, currentTest, tests });
    }, [currentTest, tests, testWords]);

    if (tests?.length !== undefined && tests.length === 0) {
        redirect("/");
    }

    if (!currentTest || !testWords || !tests) {
        return <LoadingComponent />;
    }

    const handleFinishTest = () => {
        const score =
            testWords.reduce((acc, word) => {
                if (word.isSolved && word.isCorrect) {
                    return acc + 1;
                }
                return acc;
            }, 0) / testWords.length;

        finishTest(currentTest?.id, score);
        router.push("/test_results?testId=" + currentTest?.id);
    };

    const handleListen = () => {
        const speech = new SpeechSynthesisUtterance(
            testWords[currentWordIndex]?.secondLang
        );
        speech.lang = currentLanguage.code;
        speech.rate = 0.8;
        speechSynthesis.speak(speech);
    };

    return (
        <div className="p-5 flex flex-col flex-1 overflow-x-hidden">
            <TopPanel testWords={testWords} />
            <AnimatePresence mode={"popLayout"}>
                <motion.div
                    style={{ willChange }}
                    className="q-card flex justify-center flex-col gap-3 items-center flex-1"
                    key={currentWordIndex}
                    initial={{ x: "100%", opacity: 0 }} // Start from right
                    animate={{ x: 0, opacity: 1 }} // Slide in
                    exit={{ x: "-100%", opacity: 0 }} // Slide out
                    transition={{ stiffness: 300 }} // Animation configuration
                >
                    <div className="flex flex-col gap-3 justify-start items-start border-2 border-gray-500 rounded-lg p-10 w-2/4">
                        <div className="flex justify-between items-center w-full">
                            <div className="font-bold">
                                Word No.:{" "}
                                <span className="inline-block text-[#f39200]">
                                    {currentWordIndex + 1}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 justify-start items-start w-full">
                            {currentTest?.showItems.firstLang && (
                                <div className="text-4xl">
                                    {testWords[currentWordIndex]?.firstLang}
                                </div>
                            )}
                            {currentTest?.showItems.secondLang && (
                                <div>
                                    {testWords[currentWordIndex]?.secondLang}
                                </div>
                            )}
                            {currentTest?.showItems.voice && (
                                <button
                                    className="flex mt-3 items-center cursor-pointer"
                                    onClick={handleListen}
                                    tabIndex={0}
                                >
                                    <Volume2 />
                                    <span className="inline-block ml-2 font-semibold text-lg">
                                        Listen
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="w-2/4 rounded-full flex justify-center items-center border-2 border-white overflow-hidden">
                        <Input
                            className="w-5/6 border-0 focus-visible:ring-transparent h-full"
                            onChange={(e) => setAnswer(e.target.value)}
                            value={answer}
                        />
                        <Button
                            className="w-1/6 rounded-full bg-[#f39200] hover:bg-[#c57b0c] font-semibold text-gray-100 h-full p-3"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>
            <div className="finish-button flex justify-center items-center my-10">
                <Button
                    className="bg-[#f39200] hover:bg-[#c57b0c] font-semibold text-gray-100 h-full p-3 px-10"
                    onClick={handleFinishTest}
                >
                    Finish Test
                </Button>
            </div>
            <BottomPanel
                currentWordIndex={currentWordIndex}
                setCurrentWordIndex={setCurrentWordIndex}
                testWords={testWords}
            />
        </div>
    );
};

const TopPanel = ({ testWords }: { testWords: WordTestType[] }) => {
    const router = useRouter();
    return (
        <div className="flex justify-between items-center mb-5">
            <button
                tabIndex={0}
                className="flex justify-center items-center gap-3 cursor-pointer hover:bg-slate-800 p-2 rounded-md"
                onClick={() => router.push("/")}
            >
                <MoveLeft color="#ffffff70" /> Back
            </button>
            <div className="font-bold">
                Remaining Words:{" "}
                <span className="inline-block text-[#f39200]">
                    {testWords.length -
                        testWords.filter((w) => w.isSolved === true).length}
                </span>
            </div>
        </div>
    );
};

const BottomPanel = ({
    testWords,
    currentWordIndex,
    setCurrentWordIndex,
}: {
    testWords: WordTestType[];
    currentWordIndex: number;
    setCurrentWordIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    return (
        <div>
            <h2 className="text-center text-3xl my-5">Question Panel</h2>
            <div className="flex justify-center items-center p-5 gap-10">
                <button
                    onClick={() => {
                        setCurrentWordIndex((prev) => Math.max(prev - 1, 0));
                    }}
                    className="flex justify-center items-center p-5 hover:bg-slate-400 cursor-pointer rounded-md"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={() => {
                        setCurrentWordIndex((prev) =>
                            Math.min(prev + 1, testWords.length - 1)
                        );
                    }}
                    className="flex justify-center items-center p-5 hover:bg-slate-400 cursor-pointer rounded-md"
                >
                    <ChevronRight />
                </button>
            </div>
            <div className="flex flex-wrap gap-5">
                {testWords.map((word, index) => (
                    <button
                        key={index}
                        className={cn(
                            `cursor-pointer bg-slate-800 p-2 rounded-md w-16 h-16 flex justify-center items-center transition-colors duration-500`,
                            word.isSolved && word.isCorrect && "bg-green-500",
                            word.isSolved && !word.isCorrect && "bg-red-500",
                            index === currentWordIndex && "bg-[#f39200]"
                        )}
                        onClick={() => {
                            setCurrentWordIndex(index);
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TakeTestPage;
