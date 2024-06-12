import { useEffect, useState } from "react";

export default function CommentCard({ comment }) {
    const [author, setAuthor] = useState();
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
    return (
        <div className="flex gap-4 p-4">
            <img className="w-8 h-8 rounded-full object-cover" src={author?.displayPicture} alt="comment author picture" />
            <div>
                <div className="flex gap-2">
                    <p className="font-bold">@{author?.username}</p>
                    <span className="text-gray-400">{new Date(comment.createdAt).toDateString()}</span>
                </div>
                <div>
                    <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                </div>
            </div>
        </div>
    )
}