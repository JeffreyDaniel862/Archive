import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom";
import Profile from "../components/Profile";
import SideTab from "../components/Sidebar";

export default function Dashboard() {
    const { user } = useSelector(state => state.user);
    if (!user) {
        return <Navigate to={'/sign-in'} />
    }
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabInfo = searchParams.get('tab');
        if (tabInfo) setTab(tabInfo);
    }, [location.search]);
    return (
        <div className="min-h-screen flex flex-col gap-3 md:flex-row">
            <div className="md:w-56">
                <SideTab  tab={tab}  />
            </div>
            <div>
                {tab === 'profile' && <Profile />}
            </div>
        </div>
    )
}