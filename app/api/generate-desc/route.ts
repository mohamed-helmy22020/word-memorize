import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const word = searchParams.get("word");
    if (!word) {
        return new Response("Missing word parameter", { status: 400 });
    }

    const prompt = `the word is ${word}`;
    try {
        const { text } = await generateText({
            model: groq("llama-3.3-70b-versatile"),
            prompt: `only give me the description , don't give any other text only the description if the word is invalid word return only invalid word
            ${prompt}`,
        });
        if (text.toLowerCase().includes("invalid word")) {
            return new Response("Error generating content", { status: 400 });
        }

        return new Response(text);
    } catch (e) {
        console.log({ e });
        return new Response("Error generating content", { status: 500 });
    }
}
