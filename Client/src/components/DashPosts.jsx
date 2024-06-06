import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import { FaTrash, FaEdit  } from "react-icons/fa";

const DashPosts = () => {
    const { user } = useSelector(state => state.user);
    const [postData, setPostData] = useState(undefined);
    const { data, isLoading, isError, error, isSuccess } = useQuery({
        queryKey: ['getPosts'],
        queryFn: () => fetchPost(user?.id),
        staleTime: 5000
    });

    useEffect(() => {
        if (isSuccess) {
            setPostData(data);
        }
    }, [data])

    return (
        <div>
            Dash Posts.
            {
                postData && <div className='flex flex-col md:flex-row md:flex-wrap gap-6 p-3'>
                    {postData.posts.map(post =>
                        <div className='flex flex-col gap-3 p-2 rounded-lg h-[410px]' key={post.id} >
                            <Card post={post} />
                            <div className='flex justify-around'>
                                <button className='flex gap-3 justify-center items-center p-2 border-red-700 border-2 rounded-lg hover:bg-red-800 hover:text-white hover:-translate-y-1 transition-all'>
                                    <FaTrash />
                                    <span>Delete</span>
                                </button>
                                <button className='flex gap-3 justify-center items-center p-2 border-green-700 border-2 rounded-lg hover:bg-green-600 hover:text-white hover:-translate-y-1 transition-all'>
                                    <FaEdit  />
                                    <span>Edit</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default DashPosts;

export const fetchPost = async (id) => {
    try {
        const response = await fetch(`/jd/post/getposts?userId=${id}`);
        const resData = await response.json()
        return resData;
    } catch (error) {
        console.log(error);
    }
}