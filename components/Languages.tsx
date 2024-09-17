"use client";
import { useLanguagesStore } from "@/store/userLanguages";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import AddNewLanguage from "./AddNewLanguage";
import Language from "./Language";

const Languages = ({ userLangs }: { userLangs: LanguageType[] }) => {
    const t = useTranslations("Languages");
    const router = useRouter();

    const {
        languages: allLanguages,
        changeCurrentLanguage,
        currentLanguage,
        setLangs,
    } = useLanguagesStore();

    useLayoutEffect(() => {
        setLangs(
            userLangs.map((l) => ({
                $id: l.$id,
                code: l.code,
                name: l.name,
            }))
        );
        let currentLanguage = { name: "", code: "", $id: "" };
        try {
            currentLanguage = sessionStorage.getItem("currentLanguage")
                ? JSON.parse(sessionStorage.getItem("currentLanguage")!)
                : "";
        } catch (e) {
            console.log(e);
        }

        changeCurrentLanguage(currentLanguage);
    }, []);

    return (
        <div className="languages">
            <h2 className="text-xl font-semibold">{t("Languages")}</h2>
            {allLanguages.map((lang) => (
                <Language
                    key={lang.$id}
                    name={lang.name}
                    isCurrentLanguage={lang.$id === currentLanguage.$id}
                    handleClick={() => {
                        changeCurrentLanguage(lang);
                        router.push("/");
                    }}
                />
            ))}
            <AddNewLanguage />
        </div>
    );
};

export default Languages;
