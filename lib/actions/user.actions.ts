"use server";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";
const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_FOLDERS_COLLECTION_ID: FOLDERS_COLLECTION_ID,
    APPWRITE_WORDS_COLLECTION_ID: WORDS_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
    try {
        const { database } = await createAdminClient();

        const user = await database.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("id", [userId])]
        );
        return parseStringify(user.documents[0]);
    } catch (error) {
        console.log(error);
    }
};

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        const user = await getUserInfo({ userId: session.userId });

        return parseStringify(user);
    } catch (error: any) {
        return parseStringify({ code: error.code, error: error.message });
    }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email } = userData;
    const name = email.split("@")[0];
    let newUserAccount;

    try {
        const { account, database } = await createAdminClient();

        newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (!newUserAccount) throw new Error("Error creating user");

        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                id: newUserAccount.$id,
                email,
                name,
            }
        );

        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUser);
    } catch (error: any) {
        return parseStringify({ error: error.message });
    }
};

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const result = await account.get();

        const user = await getUserInfo({ userId: result.$id });

        return parseStringify(user);
    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();

        cookies().delete("appwrite-session");

        await account.deleteSession("current");
    } catch (error) {
        return null;
    }
};

export const addNewLang = async (lang: { name: string; code: string }) => {
    const { database } = await createAdminClient();
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await database.listDocuments(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [Query.equal("id", [result.targets[0].userId])]
    );
    const { languages } = user.documents[0];
    languages.push(lang);
    const a = await database.updateDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        user.documents[0].$id,
        {
            languages: [...languages],
        }
    );
    return {
        ...lang,
        $id: a.languages[a.languages.length - 1].$id,
    };
};

export const saveDataToCookies = (name: string, data: any) => {
    cookies().set(name, data);
};

export const getPathData = async (
    userId: string,
    languageId: string,
    path: string
) => {
    const { database } = await createAdminClient();

    const fetchedFolders = await database.listDocuments(
        DATABASE_ID!,
        FOLDERS_COLLECTION_ID!,
        [
            Query.select(["name", "path", "$id"]),
            Query.and([
                Query.equal("userId", [userId]),
                Query.equal("languageId", [languageId]),
                Query.equal("path", [path]),
            ]),
        ]
    );
    const folders: FolderType[] = fetchedFolders.documents.map((folder) => ({
        name: folder.name,
        path: folder.path,
        $id: folder.$id,
    }));

    const fetchedWords = await database.listDocuments(
        DATABASE_ID!,
        WORDS_COLLECTION_ID!,
        [
            Query.select(["firstLang", "secondLang", "$id"]),
            Query.and([
                Query.equal("userId", [userId]),
                Query.equal("languageId", [languageId]),
                Query.equal("path", [path]),
            ]),
        ]
    );
    const words: WordType[] = fetchedWords.documents.map((w) => ({
        $id: w.$id,
        firstLang: w.firstLang,
        secondLang: w.secondLang,
    }));
    return { folders, words };
};

export const addNewFolder = async (
    name: string,
    path: string,
    languageId: string
) => {
    const { database } = await createAdminClient();
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await database.listDocuments(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [Query.equal("id", [result.targets[0].userId])]
    );
    const fetchedFolders = await database.listDocuments(
        DATABASE_ID!,
        FOLDERS_COLLECTION_ID!,
        [
            Query.and([
                Query.equal("userId", [user.documents[0].$id]),
                Query.equal("languageId", [languageId]),
                Query.equal("path", [path]),
                Query.equal("name", [name]),
            ]),
        ]
    );
    if (fetchedFolders.documents.length >= 1)
        return { error: "Folder already exists" };

    const promise = await database.createDocument(
        DATABASE_ID!,
        FOLDERS_COLLECTION_ID!,
        ID.unique(),
        {
            name,
            path,
            languageId,
            userId: user.documents[0].$id,
        }
    );
    console.log(promise);

    if (!promise) return { error: "Error creating folder" };
    return {
        success: true,
        newFolder: {
            name,
            path,
            languageId,
            userId: user.documents[0].$id,
            $id: promise.$id,
        },
    };
};

export const addNewWord = async (
    firstLang: string,
    secondLang: string,
    path: string,
    languageId: string
) => {
    const { database } = await createAdminClient();
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await database.listDocuments(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [Query.equal("id", [result.targets[0].userId])]
    );
    const fetchedWords = await database.listDocuments(
        DATABASE_ID!,
        WORDS_COLLECTION_ID!,
        [
            Query.and([
                Query.equal("userId", [user.documents[0].$id]),
                Query.equal("languageId", [languageId]),
                Query.equal("path", [path]),
                Query.equal("firstLang", [firstLang]),
                Query.equal("secondLang", [secondLang]),
            ]),
        ]
    );
    if (fetchedWords.documents.length >= 1)
        return { error: "Word already exists" };

    const promise = await database.createDocument(
        DATABASE_ID!,
        WORDS_COLLECTION_ID!,
        ID.unique(),
        {
            firstLang,
            secondLang,
            userId: user.documents[0].$id,
            languageId,
            path,
        }
    );
    console.log(promise);

    if (!promise) return { error: "Error creating word" };
    return {
        success: true,
        newWord: {
            firstLang,
            secondLang,
            $id: promise.$id,
        },
    };
};
