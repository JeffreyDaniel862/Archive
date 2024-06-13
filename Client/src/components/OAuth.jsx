import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import app from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/userSlice";

export default function OAuth({modal, modalClose}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleOAuth = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        provider.setCustomParameters({prompt: 'select_account'});
        try {
            const result = await signInWithPopup(auth, provider);
            const authData = {username: result.user.displayName, email: result.user.email, photo: result.user.photoURL}
            const response = await fetch("/jd/auth/Oauth", {
                method: "Post",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(authData)
            });
            const data = await response.json();
            if(response.ok){
                dispatch(login(data));
                if(modal){
                    modalClose();
                    return
                }
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Button onClick={handleOAuth} type="button" className="w-full mt-4 bg-gradient-to-r from-red-900 via-red-600 to-red-400 flex items-center" pill outline>
            <AiFillGoogleCircle className="w-6 h-6 mr-4" />
            Google
        </Button>
    )
}