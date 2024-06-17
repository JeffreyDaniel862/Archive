import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from '../components/Card';

export default function UserProfile() {
    const { id } = useParams();
    const [author, setAuthor] = useState();
    const [authorPost, setAuthorPost] = useState();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/jd/user/getUser?username=${id.substring(1)}`);
            const resData = await response.json();
            setAuthor(resData);
        }
        fetchUser();
    }, [id]);

    useEffect(() => {
        if (author) {
            const fetchUserPost = async () => {
                const response = await fetch(`/jd/post/getposts?userId=${author?.id}`);
                const resData = await response.json();
                setAuthorPost(resData.posts);
            }
            fetchUserPost();
        }
    }, [author])

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold text-center">{author?.username}'s Archive</h2>
            <div className="flex flex-col items-start justify-center gap-3 p-4 border-b-2">
                <img className=" w-20 h-20 md:w-32 md:h-32 rounded-full shadow-md object-cover border-2 border-teal-400" src={author?.displayPicture} alt="author picture" />
                <p className="italic">{author?.username}</p>
            </div>
            {
                authorPost?.length >= 1 ?
                    <>
                        <h3 className="mt-4 text-lg md:text-2xl font-semibold text-center">Writs of {author?.username}</h3>
                        <div className="flex flex-wrap gap-4 mt-4" >
                            {authorPost.map(post => <Card key={post.id} post={post} />)}
                        </div>
                    </>
                    :
                    <div className="p-3 border-2 border-sky-400 border-dotted mt-5 rounded-md">
                        <p className="font-serif text-lg dark:text-red-500 text-red-700">
                            {author?.username} do not have any writs.
                        </p>
                        <p className="italic mt-2">
                            You can follow him. If he post any writs it will be shown in your home page.
                        </p>
                    </div>
            }
        </div>
    )
}