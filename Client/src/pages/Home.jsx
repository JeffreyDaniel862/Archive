import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query'
import Card from '../components/Card';

export default function Home() {

    const { user } = useSelector(state => state.user);

    const { data: posts } = useQuery({
        queryKey: ['personalizedFeed'],
        queryFn: () => getPersonalizedFeed(user?.id),
        enabled: Boolean(user)
    });

    return (
        <div className='p-4 flex flex-col items-center min-h-screen'>
            <h1 className='text-2xl lg:text-4xl border-b-2 font-semibold mb-8'>Welcome to <span className='font-bold text-sky-600 dark:text-sky-400 font-serif'>Archive</span></h1>
            <div className='flex gap-6 flex-wrap'>
                {
                    posts && posts.map(post => <Card key={post.id} post={post} />)
                }
            </div>
        </div>
    )
}

const getPersonalizedFeed = async (id) => {
    try {
        const response = await fetch(`/jd/post/getPersonalizedFeed/${id}`);
        const resData = await response.json();
        if (!response.ok) {
            throw resData
        }
        return resData
    } catch (error) {
        console.error(error);
        return null;
    }

}