import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const DashPosts = () => {
    const { user } = useSelector(state => state.user);
    const [postData, setPostData] = useState(undefined);
    const { data, isLoading, isError, error, isSuccess } = useQuery({
        queryKey: ['getPosts'],
        queryFn: () => fetchPost(user?.id),
        staleTime: 5000
    });

    useEffect(() => {
        if(isSuccess){
            setPostData(data);
        }
    }, [data])

    return (
        <div>
            Dash Posts.
            {
                postData && postData.posts.map(post => <p key={post.id}>{post.title}</p>)
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