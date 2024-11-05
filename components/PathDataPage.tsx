"use client";
import FoldersContainer from "@/components/FoldersContainer";
import LoadingComponent from "@/components/LoadingComponent";
import WordsContainer from "@/components/WordsContainer";
import { getPathData } from "@/lib/actions/user.actions";
import { usePathNameStore } from "@/store/pathnameStore";
import { useLanguagesStore } from "@/store/userLanguagesStore";
import { useEffect, useState } from "react";
import Languages from "./Languages";
import OptionsBar from "./OptionsBar";
import ToTopButton from "./ToTopButton";

const PathDataPage = ({ path, user }: { path: string; user: User }) => {
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [words, setWords] = useState<WordType[]>([]);
    const [IsLoading, setisLoading] = useState<boolean>(true);
    const [showAllWords, setShowAllWords] = useState<boolean>(false);
    const [showPaths, setShowPaths] = useState<boolean>(false);

    const { currentLanguage } = useLanguagesStore();
    const { setPathName } = usePathNameStore();

    useEffect(() => {
        setPathName(path);
    }, [path]);

    useEffect(() => {
        if (!currentLanguage.$id) {
            setisLoading(false);
            return;
        }
        const fetchData = async () => {
            setisLoading(true);
            const { folders: fetchedFolders, words: fetchedWords } =
                await getPathData(currentLanguage.$id, path, showAllWords);

            setFolders(fetchedFolders);
            setWords(fetchedWords);
            setisLoading(false);
        };
        fetchData();
    }, [currentLanguage.$id, path, showAllWords]);

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
                words={words}
            />
            {!showAllWords && (
                <FoldersContainer folders={folders} setFolders={setFolders} />
            )}
            <WordsContainer
                words={words}
                setWords={setWords}
                showPaths={showPaths}
                showAllWords={showAllWords}
            />
            <ToTopButton />
        </div>
    );
};
export default PathDataPage;
