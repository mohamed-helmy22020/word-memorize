import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface takeTestsStateType {
    tests: TestType[] | undefined;
    addTest: (test: TestType) => void;
    clearAllTests: () => void;
    deleteTest: (id: string) => void;
    setTestWord: (
        wordId: string,
        data: WordTestType,
        currentTestId: string
    ) => void;
    finishTest: (currentTestId: string, score: number) => void;
}
export const useTakeTestsStore = create<takeTestsStateType>()(
    devtools(
        persist(
            (set) => ({
                tests: undefined,
                addTest: (test: TestType) =>
                    set(
                        produce((state: takeTestsStateType) => {
                            state.tests = state.tests || [];
                            state.tests.push(test);
                        })
                    ),
                clearAllTests: () =>
                    set(
                        produce((state: takeTestsStateType) => {
                            state.tests = [];
                        })
                    ),
                deleteTest: (id: string) =>
                    set(
                        produce((state: takeTestsStateType) => {
                            state.tests = state.tests || [];
                            state.tests = state.tests.filter(
                                (test) => test.id !== id
                            );
                        })
                    ),

                setTestWord: (
                    wordId: string,
                    data: WordTestType,
                    currentTestId: string
                ) =>
                    set(
                        produce((state: takeTestsStateType) => {
                            state.tests = state.tests || [];
                            const test = state.tests.find(
                                (test) => test.id === currentTestId
                            );
                            if (test) {
                                const word = test.words.find(
                                    (word) => word.$id === wordId
                                );
                                if (word) {
                                    word.isCorrect = data.isCorrect;
                                    word.isSolved = data.isSolved;
                                    word.answer = data.answer;
                                }
                            }
                        })
                    ),

                finishTest: (currentTestId: string, score: number) =>
                    set(
                        produce((state: takeTestsStateType) => {
                            state.tests = state.tests || [];
                            const test = state.tests.find(
                                (test) => test.id === currentTestId
                            );
                            if (test) {
                                test.isFinished = true;
                                test.score = score;
                            }
                        })
                    ),
            }),
            //options
            {
                name: "TakeTestStore",
                onRehydrateStorage: (state) => {
                    console.log("hydration starts");

                    // optional
                    return (state, error) => {
                        if (error) {
                            console.log(
                                "an error happened during hydration",
                                error
                            );
                        } else {
                            if (state && state.tests === undefined) {
                                state.tests = [];
                            }
                            console.log("hydration finished");
                        }
                    };
                },
            }
        ),
        { name: "TakeTestStore" }
    )
);
