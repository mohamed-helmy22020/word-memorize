"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAccount } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserCard = ({ user }: userCardProps) => {
    const t = useTranslations("UserCard");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleLogOut = async () => {
        if (isLoading) return;
        setIsLoading(true);
        await logoutAccount();
        localStorage.clear();
        router.push("/sign-in");
    };
    return (
        <div className="flex gap-1 border border-slate-600 rounded-md p-3 items-center">
            <Avatar className="w-1/5">
                <AvatarImage src="/icons/avater.svg" />
                <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="user-details">
                <div className="user-email" title={user.email}>
                    {user.email}
                </div>
                <div className="user-name" title={user.name}>
                    Mohamed Helmy
                </div>
            </div>
            <div className="logout" title={t("LogOut")} onClick={handleLogOut}>
                {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <Image
                        src="/icons/logout.svg"
                        width="24"
                        height="24"
                        alt="logout"
                    />
                )}
            </div>
        </div>
    );
};

export default UserCard;
