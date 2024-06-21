import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function UserCard({ user, onClose }) {
    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
                <img className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full" src={user?.displayPictureURL} alt="user picture" />
                <p className="font-semibold italic text-sm">{user?.username}</p>
            </div>
            <Link to={`/@${user?.username}`} onClick={onClose}>
                <Button outline pill>View Profile</Button>
            </Link>
        </div>
    )
}