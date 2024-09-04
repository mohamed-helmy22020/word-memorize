import { addNewLang, saveDataToCookies } from "@/lib/actions/user.actions";
import { produce } from "immer";
import { create } from "zustand";

interface languagesType {
    languages: string[];
    currentLanguage: string;
    changeCurrentLanguage: (language: string) => void;
    addNewLanguage: (language: string) => Promise<void>;
    setLangs: (languages: string[]) => void;
}

export const useLanguagesStore = create<languagesType>((set) => ({
    languages: [],
    currentLanguage: "",
    changeCurrentLanguage: (language: string) => {
        localStorage.setItem("currentLanguage", language);
        saveDataToCookies("currentLanguage", language);
        set(
            produce((state: languagesType) => {
                state.currentLanguage = language;
            })
        );
    },
    addNewLanguage: async (language: string) => {
        await addNewLang(language);
        set(
            produce((state: languagesType) => {
                state.languages.push(language);
            })
        );
    },
    setLangs: (languages: string[]) =>
        set(
            produce((state: languagesType) => {
                state.languages = languages;
            })
        ),
}));
