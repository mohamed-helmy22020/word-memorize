import WordCard from "@/components/WordCard";
import {
    getEnglishWordData,
    getLoggedInUser,
} from "@/lib/actions/user.actions";
export default async function HomePage() {
    const user = await getLoggedInUser();
    const data = await getEnglishWordData("mo");
    console.log(data);
    return (
        <div className="flex flex-wrap flex-1 min-h-screen overflow-auto p-10 gap-2 ">
            <WordCard />
        </div>
    );
}
