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
    const sentence = searchParams.get("sentence");
    if (!sentence) {
        return new Response("Missing sentence parameter", { status: 400 });
    }
    const selectedLanguage = searchParams.get("sl");
    const targetLanguage = searchParams.get("tl");
    if (!selectedLanguage || !targetLanguage) {
        return new Response("Missing selected language or target language.", {
            status: 400,
        });
    }
    const prompt = `translate this sentence "${sentence}" from ${selectedLanguage} (language code or name) to ${targetLanguage} (language code or name)`;
    try {
        const { text } = await generateText({
            model: createGroq({
                apiKey: decryptedAIKey,
            })("openai/gpt-oss-safeguard-20b"),
            prompt: `only give me the translation , don't give any other text only the translation if selected or target language is incorrect return exactly invalid selected or target language in english don't anything else and if the sentence is invalid sentence or not from the selected language return only invalid sentence in english
            ${prompt}`,
        });
        if (
            text.toLowerCase().includes("invalid sentence") ||
            text.toLowerCase().includes("invalid selected language") ||
            text.toLowerCase().includes("invalid target language")
        ) {
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
