/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
    email: string;
    password: string;
};

declare type LoginUser = {
    email: string;
    password: string;
};

declare type EditParams = {
    name: string;
    language: {
        name: string;
        code: string;
    };
};

declare type User = {
    id: string;
    email: string;
    name: string;
    language: string;
    languages: LanguageType[];
};
declare type LanguageType = {
    $id: string;
    name: string;
    code: string;
};
interface Lang {
    name: string;
    code: string;
}
declare type NewUserParams = {
    id: string;
    email: string;
    name: string;
    password: string;
};

declare interface AuthFormProps {
    type: "sign-in" | "sign-up";
}

declare interface signInProps {
    email: string;
    password: string;
}
declare interface getUserInfoProps {
    userId: string;
}
declare interface sideBarProps {
    user: User;
}
declare interface userCardProps {
    user: User;
}
declare interface User {
    id: string;
    email: string;
    name: string;
}
declare interface WordCardProps {
    firstLang: string;
    secondLang: string;
}

declare interface FolderProps {
    name: string;
}

declare interface FolderType {
    name: string;
    path: string;
    $id: string;
}

declare type TestType = {
    score: number;
    id: string;
    path: string;
    isFinished: boolean;
    wordsLength: number;
    date: number;
    includeSubdirs: boolean;
    showItems: {
        firstLang: boolean;
        secondLang: boolean;
        voice: boolean;
    };
    words: WordTestType[];
};

declare interface WordType {
    firstLang: string;
    secondLang: string;
    desc?: string;
    $id: string;
    path: string;
}
declare interface WordTestType extends WordType {
    isCorrect: boolean;
    isSolved: boolean;
    answer?: string;
}

type TranslationTypes = "ai" | "translate";
