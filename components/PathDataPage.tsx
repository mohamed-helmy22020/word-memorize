"use client";
import FoldersContainer from "@/components/FoldersContainer";
import LoadingComponent from "@/components/LoadingComponent";
import WordsContainer from "@/components/WordsContainer";
import { getPathData } from "@/lib/actions/user.actions";
import { useLanguagesStore } from "@/store/userLanguages";
import { useEffect, useState } from "react";
import Languages from "./Languages";

const PathDataPage = ({ path, user }: { path: string; user: any }) => {
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [words, setWords] = useState<WordType[]>([]);
    const [IsLoading, setisLoading] = useState<boolean>(true);

    const { currentLanguage } = useLanguagesStore();

    useEffect(() => {
        if (!currentLanguage.$id) return;
        const getData = async () => {
            setisLoading(true);
            const { folders: fetchedFolders, words: fetchedWords } =
                await getPathData(user.$id, currentLanguage.$id, path);

            setFolders(fetchedFolders);
            setWords(fetchedWords);
            setisLoading(false);
        };
        getData();
    }, [currentLanguage.$id]);

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
            <FoldersContainer
                folders={folders}
                path={path}
                setFolders={setFolders}
            />
            <WordsContainer words={words} path={path} setWords={setWords} />
        </div>
    );
};
export default PathDataPage;
