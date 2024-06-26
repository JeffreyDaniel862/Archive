import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import AnalyticsCard from "./AnalyticsCard";
import { FaUsers, FaEye, FaFileArchive } from 'react-icons/fa'
import UserCard from './UserCard'
import RecentInfoCard from "./RecentInfoCard";
import { fetchPost } from "./DashPosts";

export default function DashAnalytics() {
    const { user } = useSelector(state => state.user);

    const { data } = useQuery({
        queryKey: ["userAnalytics"],
        queryFn: () => fetchUserAnalytics(user?.id),
        enabled: Boolean(user)
    });

    const { data: followData } = useQuery({
        queryKey: ["userFollowDetail"],
        queryFn: () => fetchFollowDetails(user?.id),
        enabled: Boolean(user)
    });

    const { data: postData, isSuccess } = useQuery({
        queryKey: ['getPosts'],
        queryFn: () => fetchPost(user?.id),
        enabled: Boolean(user)
    });
    
    return (
        <div className="p-3 flex flex-col justify-start items-center gap-8">
            <h3 className="text-xl font-semibold mb-4 md:text-3xl border-b-2">Analytics</h3>
            <div className="flex gap-8 flex-wrap justify-center">
                <AnalyticsCard title={'followers'} numbers={data && data[0]?.followercount} icon={<FaUsers className="bg-teal-500 rounded-full text-5xl p-3 shadow-lg text-white group-hover:animate-bounce" />} />
                <AnalyticsCard title={'following'} numbers={data && data[0]?.followingcount} icon={<FaUsers className="bg-teal-500 rounded-full text-5xl p-3 shadow-lg text-white group-hover:animate-bounce" />} />
                <AnalyticsCard title={'Views of posts'} numbers={data && data[0]?.viewscount} icon={<FaEye className="bg-teal-500 rounded-full text-5xl p-3 shadow-lg text-white group-hover:animate-bounce" />} />
                <AnalyticsCard title={'No. of Posts'} numbers={data && data[0]?.postcount} lastMonth={data && data[0]?.lastmonthpostcount} icon={<FaFileArchive className="bg-teal-500 rounded-full text-5xl p-3 shadow-lg text-white group-hover:animate-bounce" />} />
            </div>
            <div className="flex gap-8 flex-wrap justify-center mt-5">
                <RecentInfoCard array={followData && followData?.followers} title={'Followers'} />
                <RecentInfoCard array={followData && followData?.following} title={'Following'} />
                <RecentInfoCard array={postData && postData?.posts} title={'Posts'} postInfo={true} />
            </div>
        </div>
    )
}

const fetchUserAnalytics = async (id) => {
    try {
        const response = await fetch(`jd/user/getAnalytics/${id}`);
        const resData = await response.json();
        return resData;
    } catch (error) {
        console.error(error);
    }
}

const fetchFollowDetails = async (id) => {
    try {
        const response = await fetch(`/jd/user/get-followers/${id}?limit=5`);
        const response1 = await fetch(`/jd/user/get-following/${id}?limit=5`);
        const resData = await response.json();
        const resData1 = await response1.json();
        const followDetail = { followers: resData, following: resData1 }
        console.log(followDetail);
        return followDetail;
    } catch (error) {
        console.error(error);
    }
}