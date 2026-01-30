import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
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
            model: groq("openai/gpt-oss-safeguard-20b"),
            prompt: `only give me the translation , don't give any other text only the translation if selected or target language is incorrect return exactly invalid selected or target language in english don't anything else and if the sentence is invalid sentence or not from the selected language return only invalid sentence in english
            ${prompt}`,
        });
        console.log(text);
        if (
            text.toLowerCase().includes("invalid sentence") ||
            text.toLowerCase().includes("invalid selected language") ||
            text.toLowerCase().includes("invalid target language")
        ) {
            return new Response("Error generating content", { status: 400 });
        }
        console.log(text);
        return new Response(text);
    } catch (e) {
        console.log({ e });
        return new Response("Error generating content", { status: 500 });
    }
}
