"use client";
import { useLanguagesStore } from "@/store/userLanguages";
import { useLayoutEffect } from "react";
import AddNewLanguage from "./AddNewLanguage";
import Language from "./Language";

const Languages = ({ userLangs }: { userLangs: string[] }) => {
    const {
        languages: allLanguages,
        changeCurrentLanguage,
        currentLanguage,
        setLangs,
    } = useLanguagesStore();
    useLayoutEffect(() => {
        setLangs(userLangs);
        const currentLanguage = localStorage.getItem("currentLanguage") || "";
        changeCurrentLanguage(currentLanguage);
    }, []);

    return (
        <div className="languages">
            <h2 className="text-xl font-semibold">Languages</h2>
            {allLanguages.map((lang) => (
                <Language
                    key={lang}
                    name={lang}
                    isCurrentLanguage={lang === currentLanguage}
                    handleClick={() => changeCurrentLanguage(lang)}
                />
            ))}
            <AddNewLanguage />
        </div>
    );
};

export default Languages;
