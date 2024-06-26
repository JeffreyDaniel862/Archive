import { useSelector } from "react-redux";
import { json, useLoaderData } from "react-router-dom";
import PostForm from "../components/PostForm";
import SignIn from "./SignIn";

export default function EditPost() {
    const { user } = useSelector(state => state.user);
    const postData = useLoaderData();
    return user ? <PostForm title={'Update List'} postData={postData} method={'PUT'} /> : <SignIn />
}

export const postLoader = async ({ request, params }) => {
    let URL = `/jd/post/getposts?`
    if (params.id) {
        URL = `/jd/post/getposts?id=${params.id}`
    }
    if (params.slug) {
        URL = `/jd/post/getposts?slug=${params.slug}`
    }
    try {
        const response = await fetch(URL);
        const resData = await response.json();
        if (!response.ok) {
            throw json({ message: resData.message || "Unable to fetch post" }, { status: resData.status || 500 });
        }
        return resData.posts[0];
    } catch (error) {
        throw json({ message: "Bad request" }, { status: 500 });
    }
}