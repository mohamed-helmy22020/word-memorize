import Languages from "./Languages";
import UserCard from "./UserCard";

const SideBar = ({ user }: sideBarProps) => {
    return (
        <div className="sidebar">
            <UserCard user={user} />
            <hr className="border border-gray-500" />
            <Languages userLangs={user.languages} />
        </div>
    );
};

export default SideBar;
