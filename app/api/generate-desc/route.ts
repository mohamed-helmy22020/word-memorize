import { getLoggedInUser } from "@/lib/actions/user.actions";
import { decrypt } from "@/lib/encryption";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
    const user: User | null = await getLoggedInUser();
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (!user.ai_key) {
        return new Response("No AI Key", { status: 400 });
    }
    const decryptedAIKey = await decrypt(user.ai_key);
    console.log({ decryptedAIKey });
    const searchParams = new URL(request.url).searchParams;
    const word = searchParams.get("word");
    if (!word) {
        return new Response("Missing word parameter", { status: 400 });
    }

    const prompt = `the word is ${word}`;
    try {
        const { text } = await generateText({
            model: createGroq({
                apiKey: decryptedAIKey,
            })("llama-3.3-70b-versatile"),
            prompt: `only give me the description , don't give any other text only the description if the word is invalid word return only invalid word
            ${prompt}`,
        });
        if (text.toLowerCase().includes("invalid word")) {
            return new Response("Error generating content", { status: 400 });
        }

        return new Response(text);
    } catch (e: any) {
        if (e.message.includes("Invalid API Key")) {
            return new Response("Invalid AI API Key, change it in settings.", {
                status: 400,
            });
        }
        return new Response("Error generating content", { status: 500 });
    }
}
