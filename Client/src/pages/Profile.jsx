import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from '../components/Card';
import { MdContentCopy } from 'react-icons/md';
import { FaCheck } from "react-icons/fa";
import UserCard from "../components/UserCard";
import { Button, Modal } from "flowbite-react";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from "react-redux";
import queryClient, { } from '../utils/http'

export default function UserProfile() {
    const { id } = useParams();
    const { user } = useSelector(state => state.user);
    const [author, setAuthor] = useState(undefined);
    const [authorPost, setAuthorPost] = useState(null);
    const [copy, setCopy] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/jd/user/getUser?username=${id.substring(1)}`);
                const resData = await response.json();
                setAuthor(resData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUser();
    }, [id]);

    const { data: followerData } = useQuery({
        queryKey: ['followers'],
        queryFn: () => fetchFollowers(author?.id),
        enabled: Boolean(author?.id),

    });

    const { mutate } = useMutation({
        mutationFn: followUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followers'] })
        }
    });

    useEffect(() => {
        if (author) {
            const fetchUserPost = async () => {
                try {
                    const response = await fetch(`/jd/post/getposts?userId=${author?.id}`);
                    const resData = await response.json();
                    setAuthorPost(resData.posts);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchUserPost();
            queryClient.invalidateQueries({ queryKey: ['followers'] });
        }
    }, [author]);

    useEffect(() => {
        const following = followerData?.some(followInfo => followInfo.followerid == user?.id)
        setIsFollowing(following);
    }, [followerData, author])

    const handleFollow = () => {
        mutate({ id: user?.id, followingId: author?.id });
    }

    const handleCopy = async () => {
        setCopy(true); // Set loading state
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            console.log('Copied!');
        } catch (error) {
            console.error('Copy error:', error);
        } finally {
            setTimeout(() => setCopy(false), 5000); // Reset copy state after timeout
        }
    };

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex flex-col items-start justify-center gap-3 p-4 border-b-2">
                <div className="w-full flex items-center gap-8">
                    <img className=" w-20 h-20 md:w-32 md:h-32 rounded-full shadow-md object-cover border-2 border-teal-400" src={author?.displayPicture} alt="author picture" />
                    <div>
                        <p className="md:my-4 italic text-lg md:text-3xl font-bold text-sky-600 dark:text-sky-500">{author?.username}</p>
                        <p className="hover:underline cursor-pointer hover:text-green-500" onClick={() => setShowModal(true)}>
                            {followerData?.length} {followerData?.length > 1 ? "Followers" : "Follower"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-10 mt-3 md:px-4">
                    {
                        user?.id != author?.id && <Button color={isFollowing ? "blue" : "green"} pill onClick={handleFollow}>{isFollowing ? "Following" : "Follow"}</Button>
                    }
                    {
                        !copy ?
                            <p className="flex gap-3 items-center group cursor-pointer border p-2 rounded-md hover:rounded-lg" onClick={handleCopy} >
                                <MdContentCopy className="group-hover:scale-150 delay-150 transition-all group-hover:text-green-400 text-lg" />
                                <span className="group-hover:font-bold">copy</span>
                            </p>
                            :
                            <FaCheck className="text-green-600 dark:text-green-400 animate-pulse" />
                    }
                </div>
            </div>
            <Modal show={showModal} onClose={closeModal}>
                <Modal.Header>
                    Followers
                </Modal.Header>
                <Modal.Body>
                    {
                        followerData?.length > 0 ?
                            <div>
                                {
                                    followerData?.map(follower => <UserCard key={follower.username} onClose={closeModal} user={follower} />)
                                }
                            </div>
                            :
                            <p>No Followers</p>
                    }
                </Modal.Body>
            </Modal>
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

export const followUser = async (params) => {
    try {
        const response = await fetch(`/jd/user/follow-user/${params.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ followingId: params.followingId })
        });
        return response
    } catch (error) {
        console.error(error);
        return error;
    }
}

export const fetchFollowers = async (id) => {
    try {
        const response = await fetch(`/jd/user/get-followers/${id}`);
        const resData = await response.json();
        return resData
    } catch (error) {
        console.error(error);
        return [];
    }
}