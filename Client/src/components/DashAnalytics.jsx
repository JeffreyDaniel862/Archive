import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import AnalyticsCard from "./AnalyticsCard";
import { FaUsers, FaEye, FaFileArchive } from 'react-icons/fa'

export default function DashAnalytics() {
    const { user } = useSelector(state => state.user);

    const { data } = useQuery({
        queryKey: ["userAnalytics"],
        queryFn: () => fetchUserAnalytics(user?.id),
        enabled: Boolean(user)
    });

    return (
        <div className="p-3">
            <h3 className="text-xl font-semibold mb-4 md:text-2xl">Analytics</h3>
            <div className="flex gap-4 flex-wrap justify-center">
                <AnalyticsCard title={'followers'} numbers={data && data[0]?.followercount} icon={<FaUsers className="bg-teal-500 rounded-full text-5xl p-3 shadow-lg text-white group-hover:animate-bounce" />} />
                <AnalyticsCard title={'following'} numbers={data && data[0]?.followingcount} icon={<FaUsers className="bg-teal-500 rounded-full text-5xl p-3 shadow-lg text-white group-hover:animate-bounce" />} />
                <AnalyticsCard title={'Views of posts'} numbers={data && data[0]?.viewscount} icon={<FaEye className="bg-teal-500 rounded-full text-5xl p-3 shadow-lg text-white group-hover:animate-bounce" />} />
                <AnalyticsCard title={'No. of Posts'} numbers={data && data[0]?.postcount} lastMonth={data && data[0].lastmonthpostcount} icon={<FaFileArchive className="bg-teal-500 rounded-full text-5xl p-3 shadow-lg text-white group-hover:animate-bounce" />} />
            </div>
        </div>
    )
}

export const fetchUserAnalytics = async (id) => {
    try {
        const response = await fetch(`jd/user/getAnalytics/${id}`);
        const resData = await response.json();
        return resData;
    } catch (error) {
        console.error(error);
        return error;
    }
}