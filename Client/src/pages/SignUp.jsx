import { Form, Link } from "react-router-dom";
import Input from "../components/Input";
import { Button } from "flowbite-react";

export default function SignUp() {
    return (
        <div className="min-h-screen mt-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-center p-3 max-w-3xl mx-auto">
                <div className="flex-1">
                    <div>
                        <Link to={'/'} className="text-4xl dark:text-white  font-serif">
                            <span className="px-2 py-1 font-semibold rounded-md bg-gradient-to-r from-blue-600 via-sky-500 to-teal-300">
                                JD
                            </span>
                            Blog
                        </Link>
                        <p className="text-sm mt-5 font-serif">
                            Share the Wisdom, Knowledge, Facts, News you have with the World. Let's join together and grow together. To make a change.
                        </p>
                    </div>
                </div>
                <div className="flex-1">
                    <Form action="post" className="flex flex-col gap-4">
                        <Input type={'text'} holder={'Username'} id={'username'} required />
                        <Input type={'email'} holder={'Email'} id={'email'} required />
                        <Input type={'password'} holder={'Password'} id={'password'} required />
                        <Button type="submit" className='bg-gradient-to-r from-blue-600 via-sky-500 to-teal-300 hover:transition-all delay-100 hover:-translate-y-1' pill>Sign-In</Button>
                    </Form>
                    <div className="mt-3 flex gap-6 font-semibold">
                        <span>Already a JD ?</span>
                        <Link className="text-blue-900 hover:underline" to={'/sign-in'}>Sign-in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}