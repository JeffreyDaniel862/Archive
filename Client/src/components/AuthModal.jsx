import { Alert, Button, Modal, Spinner } from "flowbite-react";
import Input from "./Input";
import OAuth from "./OAuth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";

export default function AuthModal({ showModal, onClose }) {
    const [signIn, setSignIn] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(undefined);
    const [authError, setAuthError] = useState(null);
    const dispatch = useDispatch();
    
    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        if (authError) {
            setTimeout(() => {
                setAuthError(null)
            }, 4000);
        }
    }, [authError]);

    const handleAuthAction = async (event) => {
        setIsSubmitting(true);
        event.preventDefault();
        if (formData.username) {
            const response = await authModalAction('/jd/auth/signup', formData);
            const resData = await response.json();
            if (!response.ok) {
                setAuthError(resData);
                setIsSubmitting(false)
                return
            }
            const loginResponse = await authModalAction('/jd/auth/signin', { email: formData.email, password: formData.password });
            const loginData = await loginResponse.json();
            if (!loginResponse.ok) {
                setAuthError(loginData);
                setIsSubmitting(false);
                return
            }
            dispatch(login(loginData))
        } else {
            const response = await authModalAction('/jd/auth/signin', formData);
            const resData = await response.json();
            if (!response.ok) {
                setAuthError(resData);
                setIsSubmitting(false)
                return
            }
            dispatch(login(resData));
        }
        setIsSubmitting(false)
        onClose();
    }

    return (
        <Modal show={showModal} popup onClose={onClose} size={'md'}>
            <Modal.Header />
            <Modal.Body>
                <div>
                    <h2 className="text-center text-lg md:text-xl font-semibold">{signIn ? "Sign-In" : "Sign-Up"}</h2>
                    <form onSubmit={handleAuthAction} method="post" className="flex flex-col gap-4">
                        {
                            !signIn && <Input onChange={handleChange} name='username' type={'text'} holder={'Username'} id={'username'} required />
                        }
                        <Input onChange={handleChange} name='email' type={'email'} holder={'Email'} id={'email'} required />
                        <Input onChange={handleChange} name='password' type={'password'} holder={'Password'} id={'password'} required />
                        <Button disabled={isSubmitting} type="submit" className='bg-gradient-to-r from-blue-600 via-sky-500 to-teal-300 hover:transition-all delay-100 hover:-translate-y-1' pill>
                            {isSubmitting ? <>
                                <Spinner size={'sm'} />
                                <span className="pl-3">Submitting...</span>
                            </> :
                                'Let me in'
                            }
                        </Button>
                    </form>
                    <OAuth modal={true} modalClose={onClose} />
                    <div className="mt-3 flex gap-6 font-semibold">
                        <span>{signIn ? " Not a Bee ? " : "Already a Bee ?"}</span>
                        <p onClick={() => setSignIn(prev => !prev)} className="text-blue-900 hover:underline cursor-pointer">
                            {signIn ? "Sign-up" : "Sign-In"}
                        </p>
                    </div>
                    {
                        authError && <Alert color={'failure'} className="mt-5">{authError.message || "Unable to process request now. Try again later."}</Alert>
                    }
                </div>
            </Modal.Body>
        </Modal>
    )
}

export const authModalAction = async (URL, formData) => {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    return response;
}