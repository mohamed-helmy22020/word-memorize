import PathDataPage from "@/components/PathDataPage";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const HomePage = async ({ params }: { params: { path?: string[] } }) => {
    const user = await getLoggedInUser();
    const path = `/${params.path?.join("/") || ""}${params.path ? "/" : ""}`;

    return <PathDataPage path={path} user={user} />;
};
export default HomePage;
