import { Button } from "flowbite-react";
import UserCard from "./UserCard";
import { Link } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";

export default function RecentInfoCard({ array, title, postInfo }) {

    if (array?.length == 0) {
        return <div className="flex flex-col p-3 w-full lg:w-96 gap-4 shadow-md md:w-90 dark:bg-slate-800 rounded-md">
            <h4 className="text-lg border-b-2">{title}</h4>
            <div className="flex items-center justify-between">
                <p>No {title} yet !</p>
                <Button outline pill size={'sm'}>Create Post</Button>
            </div>
        </div>
    }


    if (postInfo) {
        return (
            <div className="flex flex-col p-3 w-full gap-4 shadow-md md:w-90 dark:bg-slate-800 rounded-md">
                <div className="pb-3 border-b-2 flex justify-between items-center">
                    <h4 className="text-lg">{title}</h4>
                    <Link to={'/dashboard?tab=posts'}>
                        <Button outline pill color={"red"}>View all your writs</Button>
                    </Link>
                </div>
                {
                    array && array.map(data =>
                        <Link key={data.id} to={`/post-view/${data.slug}`}>
                            <div className="group flex items-center gap-5">
                                <img className="w-10 h-10 md:w-16 md:h-16 rounded-full" src={data.coverImage} alt="post cover image" />
                                <p className="flex items-center gap-2 flex-wrap">
                                    <span className="group-hover:text-sky-500 group-hover:underline font-semibold line-clamp-1">{data.title}</span>
                                    <span className="text-sm italic">
                                        ( {data.category} )
                                    </span>
                                </p>
                                <p className="flex gap-1 items-center italic text-sm">
                                    <FaRegEye /> <span>{data.View.views}</span>
                                </p>
                            </div>
                        </Link>
                    )
                }
            </div>
        );
    };

    return (
        <div className="flex flex-col p-3 w-full gap-4 shadow-md lg:w-96 dark:bg-slate-800 rounded-md">
            <h4 className="mb-5 text-lg border-b-2">{title}</h4>
            {
                array && array.map(data => <UserCard key={data.username} user={data} />)
            }
        </div>
    )
}