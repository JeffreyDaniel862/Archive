import { useSelector } from "react-redux";
import PostForm from "../components/PostForm";
import SignIn from "./SignIn";

export default function CreatePost() {
    const { user } = useSelector(state => state.user);

    return user ? <PostForm title={'Create Post'} method={'POST'} /> : <SignIn />
}