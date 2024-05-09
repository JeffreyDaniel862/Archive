import { useSelector } from "react-redux"
import Input from '../components/Input'
import { Button } from "flowbite-react";

export default function Profile() {
    const { user } = useSelector(state => state.user);
    return (
        <div className="mx-auto p-3 w-full max-w-lg">
            <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
            <form action="" className="flex flex-col gap-4">
                <div className="self-center w-32 h-32 cursor-pointer rounded-full overflow-hidden shadow-md">
                    <img src={user.displayPicture} alt="profile" className="rounded-full border-8 object-cover w-full h-full border-[lightblue]" />
                </div>
                <Input name='username' id={'username'} holder={'Username'} type={'text'} defaultValue={user.username} />
                <Input name='email' id={'email'} holder={'Email'} type={'email'} defaultValue={user.email} />
                <Input name='password' id={'password'} holder={'Password'} type={'password'} />
                <Button className="bg-gradient-to-r from-blue-600 to-sky-500" outline>Update</Button>
            </form>
            <div className="flex justify-between mt-5 text-red-600">
                <span className="cursor-pointer hover:underline">Delete Account</span>
                <span className="cursor-pointer hover:underline">Sign Out</span>
            </div>
        </div>
    )
}