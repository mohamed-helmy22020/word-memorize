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
    languages: string[];
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
