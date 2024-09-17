"use client";
import FoldersContainer from "@/components/FoldersContainer";
import LoadingComponent from "@/components/LoadingComponent";
import WordsContainer from "@/components/WordsContainer";
import { getPathData } from "@/lib/actions/user.actions";
import { useLanguagesStore } from "@/store/userLanguages";
import { useEffect, useState } from "react";
import Languages from "./Languages";
import OptionsBar from "./OptionsBar";

const PathDataPage = ({ path, user }: { path: string; user: any }) => {
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [words, setWords] = useState<WordType[]>([]);
    const [IsLoading, setisLoading] = useState<boolean>(true);
    const [showAllWords, setShowAllWords] = useState<boolean>(false);
    const [showPaths, setShowPaths] = useState<boolean>(false);

    const { currentLanguage } = useLanguagesStore();

    useEffect(() => {
        if (!currentLanguage.$id) return;

        const fetchAllWords = async () => {
            setisLoading(true);
            const { words: fetchedWords } = await getPathData(
                user.$id,
                currentLanguage.$id,
                path,
                showAllWords
            );
            setWords(fetchedWords);
            setisLoading(false);
        };
        if (showAllWords) {
            fetchAllWords();
            return;
        }

        const fetchData = async () => {
            setisLoading(true);
            const { folders: fetchedFolders, words: fetchedWords } =
                await getPathData(user.$id, currentLanguage.$id, path);

            setFolders(fetchedFolders);
            setWords(fetchedWords);
            setisLoading(false);
        };
        fetchData();
    }, [currentLanguage.$id, path, user.$id, showAllWords]);
    useEffect(() => {
        if (showPaths) {
            setWords((prev) => {
                return [...prev].sort((a, b) => {
                    if (a.path < b.path) {
                        return -1;
                    }
                    if (a.path > b.path) {
                        return 1;
                    }
                    return 0;
                });
            });
        }
    }, [showPaths]);

    if (IsLoading) {
        return <LoadingComponent />;
    }

    if (!currentLanguage?.$id) {
        return (
            <div className="flex flex-wrap flex-1 min-h-screen overflow-auto p-5 gap-5">
                <Languages userLangs={user?.languages!} />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap flex-1 h-fit overflow-auto gap-5">
            <OptionsBar
                showAllWords={showAllWords}
                setShowAllWords={setShowAllWords}
                setShowPaths={setShowPaths}
                showPaths={showPaths}
            />
            {!showAllWords && (
                <FoldersContainer
                    folders={folders}
                    path={path}
                    setFolders={setFolders}
                />
            )}
            <WordsContainer
                words={words}
                path={path}
                setWords={setWords}
                showPaths={showPaths}
                showAllWords={showAllWords}
            />
        </div>
    );
};
export default PathDataPage;
