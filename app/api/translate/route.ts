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
    try {
        const result = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${selectedLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(sentence)}`,
            {
                method: "GET",
            },
        );
        const response = await result.json();
        console.log(response[0][0][0]);

        return new Response(response[0][0][0]);
    } catch (e) {
        return new Response("Error translating content", { status: 500 });
    }
}
