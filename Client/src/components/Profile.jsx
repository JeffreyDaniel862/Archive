import { useSelector } from "react-redux"
import Input from '../components/Input'
import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import app from '../firebase.js'
import { Form, useNavigation } from "react-router-dom";

export default function Profile() {
    const initialUploadData = {
        uploadPercentage: 0,
        uploadError: null,
        isuploadError: false,
        isUploading: false,
        isUploadSuccess: false
    }
    const { user } = useSelector(state => state.user);
    const [uploadData, setUploadData] = useState(initialUploadData);
    const [file, setFile] = useState();
    const [formData, setFormData] = useState({ user: user?.id })
    const imageRef = useRef();
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
                        setFormData(prevData => ({ ...prevData, displayPicture: downloadURL }));
                    })
            }
        );
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData)
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
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-sky-500" outline>
                    Update
                </Button>
            </Form>
            <div className="flex justify-between mt-5 text-red-600">
                <span className="cursor-pointer hover:underline">Delete Account</span>
                <span className="cursor-pointer hover:underline">Sign Out</span>
            </div>
        </div>
    )
}