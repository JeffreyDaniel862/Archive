import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Card from "./Card";
import { useState } from "react";

export default function DashCollections() {
    const { user } = useSelector(state => state.user);
    const [savedPost, setSavedPost] = useState(false);
    const { data: savedPosts } = useQuery({
        queryKey: ["UsersSavedPost"],
        queryFn: () => getSavedPost(user?.id),
        enabled: Boolean(user)
    });
    const { data: likedData } = useQuery({
        queryKey: ['userLikedPost', user.id],
        queryFn: () => getLikedPost(user?.id),
        enabled: Boolean(user)
    });
    return (
        <div className="p-4 flex flex-col gap-5 w-full">
            <div className="flex justify-center gap-6">
                <button className={`p-2 rounded-md border border-green-700 dark:border-green-400 font-medium ${savedPost && 'bg-green-700 dark:bg-green-400'}`} onClick={() => setSavedPost(true)}>
                    Saved Posts
                </button>
                <button className={`p-2 rounded-md border border-green-700 dark:border-green-400 font-medium ${!savedPost && 'bg-green-700 dark:bg-green-400'}`} onClick={() => setSavedPost(false)} >
                    Liked Posts
                </button>
            </div>
            <div className="flex flex-col gap-5 items-center w-full p-3 shadow-lg rounded-md">
                <h2 className="text-2xl lg:text-3xl font-semibold border-b-2">{!savedPost ? "Liked" : "Saved"} Post</h2>
                <div className="flex gap-6 md:gap-8 flex-wrap w-full">
                    {
                        !savedPost ?
                            likedData && likedData.length > 0 ? likedData.map(post => <Card key={post.id} post={post} />) : <p>No posts</p>
                            :
                            savedPosts && savedPosts.length > 0 ? savedPosts.map(post => <Card key={post.id} post={post} />) : <p>No posts</p>
                    }
                </div>
            </div>
        </div>
    )
}

const getSavedPost = async (id) => {
    try {
        const response = await fetch(`/jd/user/getSavedPosts/${id}`);
        const resData = await response.json();
        if (!response.ok) {
            throw resData;
        }
        return resData;
    } catch (error) {
        console.error(error);
    }
}

const getLikedPost = async (id) => {
    try {
        const response = await fetch(`/jd/user/getLikedPosts/${id}`);
        const resData = await response.json();
        if (!response.ok) {
            throw resData;
        }
        return resData
    } catch (error) {
        console.error(error);
    }
}