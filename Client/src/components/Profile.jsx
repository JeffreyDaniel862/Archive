import { useDispatch, useSelector } from "react-redux"
import Input from '../components/Input'
import { Alert, Button, Modal, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import app from '../firebase.js'
import { Form, Link, useActionData, useNavigate, useSubmit } from "react-router-dom";
import { destroy, logout, update } from "../store/userSlice.js";
import { useMutation } from "@tanstack/react-query";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function Profile() {
    const initialUploadData = {
        uploadPercentage: 0,
        uploadError: null,
        isuploadError: false,
        isUploading: false,
        isUploadSuccess: false
    }
    const initialReturnData = {
        isSubmitting: false,
        isSuccess: false,
        isError: false,
        returnError: null
    }
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { mutate, isError, error, isPending, isSuccess } = useMutation({
        mutationFn: deleteUser
    })
    useEffect(() => {
        if (isSuccess) {
            navigate('/sign-in');
            setTimeout(() => {
                dispatch(destroy());
            }, 20);
        }
    }, [isSuccess, dispatch, navigate]);
    const handleDelete = (id) => {
        setShowModal(false);
        mutate(id);
    }
    const { user } = useSelector(state => state.user);
    const [showModal, setShowModal] = useState(false);
    const [uploadData, setUploadData] = useState(initialUploadData);
    const [returnData, setReturnData] = useState(initialReturnData);
    const [file, setFile] = useState();
    const [formData, setFormData] = useState({ id: user?.id })
    const imageRef = useRef();
    const submit = useSubmit();
    const data = useActionData();

    useEffect(() => {
        if (file) {
            handleUpload(file);
        }
    }, [file]);
    useEffect(() => {
        if (uploadData.isUploadSuccess || uploadData.isuploadError) {
            setTimeout(() => {
                setUploadData(initialUploadData)
            }, 3000);
        }
    }, [uploadData.isUploadSuccess, uploadData.isuploadError]);

    useEffect(() => {
        if (data && data.statusCode == 200) {
            dispatch(update(data));
            setReturnData(prevData => ({ ...prevData, isSubmitting: false, isSuccess: true }))
        }
        if (data && data.statusCode != 200) {
            setReturnData(prevData => ({ ...prevData, isError: true, isSubmitting: false, returnError: data.message || "Unable to update" }));
        }
    }, [data, dispatch, setReturnData])

    useEffect(() => {
        if (returnData.isError || returnData.isSuccess) {
            setTimeout(() => {
                setReturnData(initialReturnData);
            }, 5000);
        }
    }, [returnData.isError, returnData.isSuccess])

    //Uploading image file to firebase storage to get image link
    const handleUpload = async (file) => {
        setUploadData(initialUploadData);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadData({ ...uploadData, uploadPercentage: progress, isUploading: true });
            },
            error => {
                setUploadData({ ...uploadData, isUploading: false, uploadError: "Error occured while uploading", isuploadError: true });
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => {
                        setUploadData({ ...uploadData, isUploading: false, isUploadSuccess: true });
                        setFormData(prevData => ({ ...prevData, displayPictureURL: downloadURL }));
                    })
            }
        );
    }

    const handleSignOut = async () => {
        const response = await fetch('/jd/auth/signout');
        if (response.ok) {
            navigate('/sign-in');
            setTimeout(() => {
                dispatch(logout());
            }, 250);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (Object.keys(formData).length > 1) {
            setReturnData(prevData => ({ ...prevData, isSubmitting: true }));
            submit(formData, { method: 'PUT' });
        }
    }

    let content;

    if (uploadData.isUploadSuccess) {
        content = <Alert color={'success'}>Success. Click update to save :)</Alert>
    }

    if (uploadData.uploadPercentage > 0 && uploadData.uploadPercentage < 100) {
        content = <progress
            className="self-center [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   
        [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-sky-500
         [&::-moz-progress-bar]:bg-slate-300" max={100} value={uploadData.uploadPercentage}>{uploadData.uploadPercentage}%
        </progress>
    }

    if (uploadData.isuploadError) {
        content = <Alert color={'failure'}>{uploadData.uploadError}</Alert>
    }

    let returnContent;

    if (returnData.isSuccess) {
        returnContent = <Alert className="mt-5" color={'success'}>Successfully updated :)</Alert>
    }
    if (returnData.isError) {
        returnContent = <Alert className="mt-5" color={'failure'}>{returnData.returnError}</Alert>
    }

    return (
        <div className="mx-auto p-3 w-full max-w-lg">
            <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
            <Form method="POST" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="file" ref={imageRef} accept="image/*" hidden onChange={e => setFile(e.target.files[0])} />
                <div className="self-center w-32 h-32 cursor-pointer rounded-full overflow-hidden shadow-md">
                    <img onClick={() => imageRef.current.click()} src={formData.displayPicture || user.displayPicture} alt="profile" className="rounded-full border-8 object-cover w-full h-full border-[lightblue]" />
                </div>
                {content}
                <Input onChange={handleChange} name='username' id={'username'} holder={'Username'} type={'text'} defaultValue={user.username} />
                <Input onChange={handleChange} name='email' id={'email'} holder={'Email'} type={'email'} defaultValue={user.email} />
                <Input onChange={handleChange} name='password' id={'password'} holder={'Password'} type={'password'} />
                <Button disabled={uploadData.isUploading} type="submit" className="bg-gradient-to-r from-blue-600 to-sky-500" outline>
                    {returnData.isSubmitting ? <>
                        <Spinner size={'sm'} />
                        <span className="pl-3">Submitting...</span>
                    </> :
                        'Update'
                    }
                </Button>
            </Form>
            {returnContent}
            <div className="mt-5 w-full">
                <Link to={'/create-post'}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 via-sky-500 to-sky-300">Create Post</Button>
                </Link>
            </div>
            <div className="flex justify-between mt-5 text-red-600">
                <span className="cursor-pointer hover:underline" onClick={() => setShowModal(true)}>Delete Account</span>
                <span className="cursor-pointer hover:underline" onClick={handleSignOut}>Sign Out</span>
            </div>
            <Modal show={showModal} popup onClose={() => setShowModal(false)} size={'md'}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold">
                            Are you sure to delete this account? This action cannot be undone.
                        </h3>
                        <div className="flex justify-evenly mt-3">
                            <Button className="bg-red-600 text-black hover:bg-red-700" onClick={() => handleDelete(user?.id)}>Yes, Delete</Button>
                            <Button onClick={() => setShowModal(false)} outline>Cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {
                isError && !isPending && <Alert color={'failure'} className="mt-5">{error.message || "Unable to delete"}</Alert>
            }
        </div>
    )
}

export const userAction = async ({ request }) => {
    const data = await request.formData();
    const userInfo = {}
    data.forEach((value, key) => userInfo[key] = value);
    const { id, ...userData } = userInfo;
    console.log(userInfo);
    try {
        const response = await fetch(`/jd/user/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await fetch(`/jd/user/delete/${id}`, {
            method: "DELETE"
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}