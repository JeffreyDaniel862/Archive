import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import { FaTrash, FaEdit } from "react-icons/fa";
import { Button } from 'flowbite-react'

const DashPosts = () => {
    const { user } = useSelector(state => state.user);
    const [postData, setPostData] = useState(undefined);
    const [showMore, setShowMore] = useState(true);
    const { data, isSuccess } = useQuery({
        queryKey: ['getPosts'],
        queryFn: () => fetchPost(user?.id),
        staleTime: 5000
    });

    useEffect(() => {
        if (isSuccess) {
            setPostData(data.posts);
            if (data.posts.length < 9) {
                setShowMore(false)
            }
        }
    }, [data]);

    const handleShowMore = async () => {
        const startIndex = postData.length;
        const data = await fetchPost(user?.id, startIndex);
        setPostData(prev => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
            setShowMore(false);
        }
    }

    return (
        <div className='flex flex-col items-center p-2'>
            Dash Posts.
            {
                postData && <div className='flex flex-col md:flex-row md:flex-wrap gap-6 p-3'>
                    {postData.map(post =>
                        <div className='flex flex-col gap-3 p-2 rounded-lg h-[410px]' key={post.id} >
                            <Card post={post} />
                            <div className='flex justify-around'>
                                <button className='flex gap-3 justify-center items-center p-2 border-red-700 border-2 rounded-lg hover:bg-red-800 hover:text-white hover:-translate-y-1 transition-all'>
                                    <FaTrash />
                                    <span>Delete</span>
                                </button>
                                <button className='flex gap-3 justify-center items-center p-2 border-green-700 border-2 rounded-lg hover:bg-green-600 hover:text-white hover:-translate-y-1 transition-all'>
                                    <FaEdit />
                                    <span>Edit</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            }
            {showMore && <Button onClick={handleShowMore}>Show more ...</Button>}
        </div>
    )
}

export default DashPosts;

export const fetchPost = async (id, startIndex) => {
    let URL = `/jd/post/getposts?userId=${id}`
    if (startIndex) {
        URL = `/jd/post/getposts?userId=${id}&startIndex=${startIndex}`
    }
    try {
        const response = await fetch(URL);
        const resData = await response.json()
        return resData;
    } catch (error) {
        console.log(error);
    }
}