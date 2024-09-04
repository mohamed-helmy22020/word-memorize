"use server";
import { JSDOM } from "jsdom";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";
const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
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

export const addNewLang = async (lang: string) => {
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
    await database.updateDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        user.documents[0].$id,
        {
            languages,
        }
    );
};

export const saveDataToCookies = (name: string, data: any) => {
    cookies().set(name, data);
};

export const getEnglishWordData = async (word: string) => {
    const res = await fetch(
        `https://dictionary.cambridge.org/pronunciation/english/${word}`
    );
    const restext = await res.text();
    const dom = new JSDOM(restext);
    const document = dom.window.document;
    if (document.title.includes("404")) return null;

    const data: any = {};
    data.USMedia =
        "https://dictionary.cambridge.org" +
        document.querySelector("#audio2")?.querySelector("source")?.src;
    data.USPronunce = document
        .querySelector('[data-pron-region="US"]')
        ?.querySelector(".pron")?.textContent;

    data.UKMedia =
        "https://dictionary.cambridge.org" +
        document.querySelector("#audio1")?.querySelector("source")?.src;
    data.UKPronunce = document
        .querySelector('[data-pron-region="UK"]')
        ?.querySelector(".pron")?.textContent;

    return data;
};
