import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import queryClient from '../utils/http';
import CommentCard from './CommentCard';

export default function Comment({ postId }) {
    const { user } = useSelector(state => state.user);
    const [comment, setComment] = useState("");
    const { data: commentData, isError, error } = useQuery({
        queryFn: () => getComments(postId),
        queryKey: ['postComments'],
        staleTime: 5000
    });

    const { mutate, data } = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments'] });
        }
    });

    const { mutate: updateMutation } = useMutation({
        mutationFn: updateComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments'] });
        }
    })

    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments'] });
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        mutate({ userId: user.id, postId, content: comment });
    }

    useEffect(() => {
        if (data && data.statusCode == 200) {
            setComment("")
        }
    }, [data]);

    return (
        <div>
            {
                user ?
                    <>
                        <div className='flex gap-2 items-center text-sm text-gray-400'>
                            <p> Signed in as :</p>
                            <img className='h-7 w-7 rounded-full' src={user.displayPicture} alt="display picture" />
                            <Link className='text-sky-600 dark:text-sky-400' to={'/dashboard?tab=profile'}>@{user.username}</Link>
                        </div>
                        <form onSubmit={handleSubmit} className='mt-5 border border-sky-300 dark:border-sky-700 p-3 rounded-md'>
                            <Textarea
                                placeholder='Add comments about this post ...'
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                                maxLength={200}
                            />
                            <div className='mt-4 flex justify-between items-center'>
                                <p className='text-gray-400'>{200 - comment.length} characters remaining.</p>
                                <Button type='submit' outline pill className='bg-gradient-to-r from-blue-600 via-sky-500 to-teal-300'>Submit</Button>
                            </div>
                            {
                                data && data?.statusCode != 200 && <Alert className='mt-5' color={'failure'}>{data?.message || 'Unable to post comment'}</Alert>
                            }
                        </form>
                    </>
                    :
                    <div className='flex gap-2 text-sky-500'>
                        <p>Please login to comment --&gt;</p>
                        <Link className='hover:underline' to={'/sign-in'}>Sign-in</Link>
                    </div>
            }
            {
                commentData && commentData?.comments.length === 0 ?
                    <p className='mt-5 text-sm italic text-gray-600 dark:text-gray-400'>No comments yet !! you can be the first one to comment.</p>
                    :
                    <div className='mt-5'>
                        <p className='text-lg font-semibold'>Comments <span className='ml-3 border-2 px-3 text-sm py-1 rounded-lg'>{commentData?.count}</span></p>
                        {commentData?.comments.map(comment => <CommentCard key={comment.id} comment={comment} onUpdate={updateMutation} onDelete={deleteMutation} />)}
                    </div>
            }
        </div>
    )
}

export const postComment = async (comment) => {
    try {
        const response = await fetch('/jd/comment/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(comment)
        });
        const resData = await response.json();
        return resData;
    } catch (error) {
        return error;
    }
}

export const getComments = async (postId) => {
    try {
        const response = await fetch(`/jd/comment/get-post-comments/${postId}`);
        const resData = await response.json();
        return resData;
    } catch (error) {
        return error
    }
}

export const updateComment = async (params) => {
    const { commentId, userId, content } = params;
    try {
        const response = await fetch(`/jd/comment/update-comment/${commentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, content })
        });
        const resData = await response.json();
        return resData;
    } catch (error) {
        console.log(error);
    }
}

export const deleteComment = async (params) => {
    const { userId, commentId } = params;
    try {
        const response = await fetch(`/jd/comment/delete/${userId}/${commentId}`, {
            method: "DELETE"
        });
        const resData = await response.json();
        return resData;
    } catch (error) {
        console.log(error);
    }
}