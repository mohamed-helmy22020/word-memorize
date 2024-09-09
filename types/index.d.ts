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

declare type User = {
    id: string;
    email: string;
    name: string;
    languages: LanguageType[];
};
declare type LanguageType = {
    $id: string;
    name: string;
    code: string;
};

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

declare interface WordType {
    firstLang: string;
    secondLang: string;
    $id: string;
}
