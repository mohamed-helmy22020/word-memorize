"use client";
import { useSideBarStore } from "@/store/sideBarStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Languages from "./Languages";
import UserCard from "./UserCard";
const SideBar = ({ user }: sideBarProps) => {
    const { show, setShow } = useSideBarStore();

    return (
        <div className={`sidebar ${show ? "show" : "hide"}`}>
            <div className="show-side-bar">
                <button onClick={() => setShow(!show)}>
                    {show ? <ChevronLeft /> : <ChevronRight />}
                </button>
            </div>
            <UserCard user={user} />
            <hr className="border border-gray-500" />
            <Languages userLangs={user.languages} />
        </div>
    );
};

export default SideBar;
