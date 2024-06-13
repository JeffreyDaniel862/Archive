import { useLoaderData } from "react-router-dom";
import { Button } from 'flowbite-react'
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import { FaCheck, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { useSelector } from "react-redux";
import AuthModal from "../components/AuthModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../utils/http";

export default function PostPage() {
    const post = useLoaderData();
    const [author, setAuthor] = useState(undefined);
    const [copy, setCopy] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [liked, setLiked] = useState(false);
    const { user } = useSelector(state => state.user);

    const { data } = useQuery({
        queryKey: ['likesOfPost'],
        queryFn: () => getLikes(post?.id)
    });

    const { mutate } = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['likesOfPost'] });
        }
    })

    useEffect(() => {
        if (data) {
            const ans = data?.likedUsers.findIndex(likedUser => likedUser.userId == user?.id);
            if (ans != -1) {
                setLiked(true);
            } else {
                setLiked(false)
            }
        }
    }, [data])

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

    const handleCopy = () => {
        setCopy(true);
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(
            () => {
                console.log('Copied!');
            },
            () => {
                console.log('Copy error')
            }
        );
        setTimeout(() => {
            setCopy(false)
        }, 5000);
    }

    const handleLike = () => {
        mutate({ postId: post?.id, userId: user?.id })
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <main className="p-3 flex flex-col gap-3 items-center max-w-6xl min-h-screen mx-auto">
                <h1 className="text-3xl text-center font-serif lg:text-4xl max-w-2xl mx-auto mt-10">{post.title}</h1>
                <Button className="mt-5" pill color={'gray'} size={'xs'}>{post && post.category}</Button>
                <img className="w-full max-h-[660px] object-cover mt-10 rounded-lg" src={post.coverImage} alt="cover image" />
                <div className="border-b-2 border-slate-500 w-full px-2 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div className="flex gap-2 md:gap-6 items-center py-3 text-sm italic">
                        <img className="h-6 w-6 md:h-10 md:w-10 rounded-full" src={author?.displayPicture} alt="Author's Picture" />
                        <div className="flex flex-col gap-2 md:gap-3 justify-center items-start">
                            <p className="italic text-sm md:text-lg">{author?.username}</p>
                            <p className="text-gray-400">
                                <span className="pr-1">Published On:</span>
                                {new Date(post.createdAt).toDateString()}
                                <span className="px-2 md:px-4">-</span>
                                {post && (post.content.length / 1000).toFixed(0)} mins read
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-lg py-3 text-gray-500 dark:text-gray-400">
                        <p className="flex gap-2 items-center">
                            {
                                liked ?
                                    <FaHeart className="text-red-700" title="like" onClick={handleLike} />
                                    :
                                    <FaRegHeart title="like" onClick={user ? handleLike : () => setShowModal(true)} />
                            }
                            <span className="text-sm font-semibold">{data && data?.count}</span>
                        </p>
                        <FaRegBookmark title="save" onClick={user ? () => { console.log("clicked") } : () => setShowModal(true)} />
                        {copy ? <FaCheck className="text-green-600 dark:text-green-400 animate-pulse" /> : <MdContentCopy title="copy" onClick={handleCopy} />}
                    </div>
                </div>
                <article className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post && post.content }}>

                </article>
                <div className="max-w-2xl mx-auto w-full p-3 border-t-2">
                    <Comment postId={post.id} />
                </div>
            </main>
            <AuthModal showModal={showModal} onClose={closeModal} />
        </>
    )
}

export const getLikes = async (id) => {
    const response = await fetch(`/jd/post/likesOfPost/${id}`);
    const resData = await response.json();
    return resData;
}

export const likePost = async (params) => {
    const { postId, userId } = params
    const response = await fetch("/jd/post/like-post/" + postId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
    });
    const resData = await response.json();
    return resData;
}