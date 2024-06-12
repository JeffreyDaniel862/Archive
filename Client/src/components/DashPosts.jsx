import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import { FaTrash, FaEdit } from "react-icons/fa";
import { Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import queryClient from '../utils/http';
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const { user } = useSelector(state => state.user);
    const [postData, setPostData] = useState(undefined);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [preDeleteInfo, setPreDeleteInfo] = useState({
        confirm: false,
        slug: undefined,
        id: undefined
    });

    const { data, isSuccess } = useQuery({
        queryKey: ['getPosts'],
        queryFn: () => fetchPost(user?.id),
        staleTime: 5000
    });
    const { mutate, data: deleteResponse } = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getPosts'] })
        }
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

    const handleDeletePost = () => {
        const data = { userId: user?.id, postId: preDeleteInfo.id }
        mutate(data);
        setShowModal(false)
    }

    const handleModal = (post) => {
        setPreDeleteInfo(prev => ({ ...prev, slug: post.slug, id: post.id }));
        setShowModal(true);
    }

    return (
        postData?.length > 0 ?
            <div className='flex flex-col items-center p-2'>
                <div className='flex flex-col md:flex-row md:flex-wrap gap-6 p-3'>
                    {postData.map(post =>
                        <div className='flex flex-col gap-3 p-2 rounded-lg h-[410px]' key={post.id} >
                            <Card post={post} />
                            <div className='flex justify-around'>
                                <button onClick={() => handleModal(post)} className='flex gap-3 justify-center items-center p-2 border-red-700 border-2 rounded-lg hover:bg-red-800 hover:text-white hover:-translate-y-1 transition-all'>
                                    <FaTrash />
                                    <span>Delete</span>
                                </button>
                                <Link to={`/update-post/${post.id}`}>
                                    <button className='flex gap-3 justify-center items-center p-2 border-green-700 border-2 rounded-lg hover:bg-green-600 hover:text-white hover:-translate-y-1 transition-all'>
                                        <FaEdit />
                                        <span>Edit</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <Modal show={showModal} popup onClose={() => setShowModal(false)} size={'md'}>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold">
                                Are you sure to delete this Post? This action cannot be undone.
                            </h3>
                            <div className='py-2 flex flex-col gap-2 items-center'>
                                <p className='text-slate-500 font-medium'>To proceed further type the following: <br /> <span className='text-lg font-bold text-slate-400'>"{preDeleteInfo.slug}"</span> </p>
                                <input autoFocus onChange={(e) => setPreDeleteInfo(prev => ({ ...prev, confirm: e.target.value == prev.slug }))} type="text" placeholder='Type here ...' />
                            </div>
                            <div className="flex justify-evenly mt-3">
                                <Button disabled={!preDeleteInfo.confirm} className="bg-red-600 text-black hover:bg-red-700" onClick={handleDeletePost}>Yes, Delete</Button>
                                <Button onClick={() => setShowModal(false)} outline>Cancel</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                {showMore && <Button onClick={handleShowMore}>Show more ...</Button>}
            </div>
            :
            <div className='max-w-2xl max-h-60 mx-auto mt-10 flex flex-col items-center justify-center gap-6 w-full p-3 border border-sky-700 dark:border-sky-400 rounded-md'>
                <p>You have not published any writs.</p>
                <Link to={'/create-post'}>
                    <Button outline pill>Create post</Button>
                </Link>
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

export const deletePost = async ({ userId, postId }) => {
    try {
        const response = await fetch(`/jd/post/delete/${postId}/${userId}`, {
            method: "DELETE"
        });
        const resData = await response.json();
        return resData;
    } catch (error) {
        console.log(error);
    }
}