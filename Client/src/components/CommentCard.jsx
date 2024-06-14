import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaTrash, FaEdit, FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";

export default function CommentCard({ comment, onUpdate }) {
    const { user } = useSelector(state => state.user);
    const [author, setAuthor] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState('');
    useEffect(() => {
        if (comment) {
            const fetchUser = async () => {
                const response = await fetch(`/jd/user/getUser/${comment.userId}`);
                const resData = await response.json();
                if (response.ok) {
                    setAuthor(resData)
                }
            }
            fetchUser();
        }
    }, [comment]);

    useEffect(() => {
        if (isEditing) {
            setContent(comment?.content)
        }
    }, [isEditing])

    const handleUpdate = (e) => {
        e.preventDefault();
        onUpdate({ commentId: comment.id, userId: comment.userId, content });
        setIsEditing(false);
    }

    return (
        <div className="flex gap-4 p-4">
            <img className="w-8 h-8 rounded-full object-cover" src={author?.displayPicture} alt="comment author picture" />
            <div className="flex-1">
                <div className="flex gap-2">
                    <p className="font-bold truncate">@{author ? author?.username : 'anonymous user'}</p>
                    <span className="text-gray-400">{new Date(comment.createdAt).toDateString()}</span>
                </div>
                <div className="flex flex-col gap-2">
                    {
                        isEditing ?
                            <form onSubmit={handleUpdate} className="flex flex-col">
                                <Textarea rows={3} onChange={(e) => setContent(e.target.value)} defaultValue={comment.content} className="my-2" />
                                <div className="flex gap-3 self-end">
                                    <Button type="button" size={'sm'} outline pill onClick={() => setIsEditing(false)}>cancel</Button>
                                    <Button type="submit" size={'sm'} pill className="bg-gradient-to-r from-blue-600 to-teal-400">save</Button>
                                </div>
                            </form>
                            :
                            <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                    }
                    {
                        !isEditing &&
                        <div className="flex gap-6">
                            <FaThumbsUp className="text-gray-400 hover:text-blue-500 hover:scale-150 transition-all delay-150" />
                            {
                                user?.id == comment.userId && <div className="flex gap-4">
                                    <FaEdit onClick={() => setIsEditing(true)} className="text-green-700 dark:text-green-400 hover:scale-150 transition-all delay-150" />
                                    <FaTrash className="text-red-700 dark:text-red-500 hover:scale-150 transition-all delay-150" />
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}