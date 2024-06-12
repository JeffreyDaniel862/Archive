import { useLoaderData } from "react-router-dom";
import { Button } from 'flowbite-react'
import { useEffect, useState } from "react";
import Comment from "../components/Comment";

export default function PostPage() {
    const post = useLoaderData();
    const [author, setAuthor] = useState(undefined);
    useEffect(() => {
        if (post) {
            const fetchUser = async () => {
                const response = await fetch(`/jd/user/getUser/${post.userId}`);
                const resData = await response.json();
                if (response.ok) {
                    setAuthor(resData)
                }
            }
            fetchUser();
        }
    }, [post]);

    return (
        <main className="p-3 flex flex-col gap-3 items-center max-w-6xl min-h-screen mx-auto">
            <h1 className="text-3xl font-serif lg:text-4xl max-w-2xl mx-auto mt-10">{post.title}</h1>
            <Button className="mt-5" pill color={'gray'} size={'xs'}>{post && post.category}</Button>
            <img className="w-full max-h-[660px] object-cover mt-10 rounded-lg" src={post.coverImage} alt="cover image" />
            <div className="flex justify-between items-center mx-auto p-3 text-sm w-full border-b-2 border-slate-500 italic">
                <div className="flex gap-3 justify-center items-center">
                    <img className="h-10 w-10 rounded-full" src={author?.displayPicture} alt="Author's Picture" />
                    <p className="italic text-lg">{author?.username}</p>
                </div>
                <p><span className="px-1">Published On:</span> {new Date(post.createdAt).toDateString()}</p>
                <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <article className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post && post.content }}>

            </article>
            <div className="max-w-2xl mx-auto w-full p-3">
                <Comment postId={post.id} />
            </div>
        </main>
    )
}