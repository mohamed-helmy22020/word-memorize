import SideBar from "@/components/SideBar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const MainLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const user = await getLoggedInUser();
    if (!user) {
        redirect("/sign-in");
    }
    return (
        <div className="flex gap-1">
            <SideBar user={user} />
            {children}
        </div>
    );
};

export default MainLayout;
