import { addNewLang } from "@/lib/actions/user.actions";
import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface languagesStateType {
    languages: LanguageType[];
    currentLanguage: LanguageType;
    changeCurrentLanguage: (language: LanguageType) => void;
    addNewLanguage: (language: { name: string; code: string }) => Promise<void>;
    setLangs: (languages: LanguageType[]) => void;
}
export const useLanguagesStore = create<languagesStateType>()(
    devtools(
        (set) => ({
            languages: [],
            currentLanguage: {
                code: "",
                name: "",
                $id: "",
            },
            changeCurrentLanguage: (language: LanguageType) => {
                sessionStorage.setItem(
                    "currentLanguage",
                    JSON.stringify(language)
                );
                set(
                    produce((state: languagesStateType) => {
                        state.currentLanguage = language;
                    })
                );
            },
            addNewLanguage: async (language: {
                name: string;
                code: string;
            }) => {
                const addedLanguage: LanguageType = await addNewLang(language);
                set(
                    produce((state: languagesStateType) => {
                        state.languages.push(addedLanguage);
                    })
                );
            },
            setLangs: (languages: LanguageType[]) =>
                set(
                    produce((state: languagesStateType) => {
                        state.languages = languages;
                    })
                ),
        }),
        { name: "Languages Store" }
    )
);
