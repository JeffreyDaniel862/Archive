import { Form, Link, useActionData, useNavigate, useNavigation } from "react-router-dom";
import Input from "../components/Input";
import { Alert, Button, Spinner } from "flowbite-react";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { useEffect } from "react";

export default function SignIn() {

    const navigation = useNavigation();
    const isSubmitting = navigation.state == 'submitting';
    const dispatch = useDispatch();
    const data = useActionData();
    const navigate = useNavigate();

    useEffect(() => {
        if (data && data.statusCode == 200) {
            const { statusCode, ...user } = data
            dispatch(login(user));
            navigate('/');
        }
    }, [data, dispatch, navigate])

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
                    <Form method="post" className="flex flex-col gap-4">
                        <Input name='email' type={'email'} holder={'Email'} id={'email'} required />
                        <Input name='password' type={'password'} holder={'Password'} id={'password'} required />
                        <Button disabled={isSubmitting} type="submit" className='bg-gradient-to-r from-blue-600 via-sky-500 to-teal-300 hover:transition-all delay-100 hover:-translate-y-1' pill>
                            {isSubmitting ? <>
                                <Spinner size={'sm'} />
                                <span className="pl-3">Submitting...</span>
                            </> :
                                'Sign-in'
                            }
                        </Button>
                    </Form>
                    <div className="mt-3 flex gap-6 font-semibold">
                        <span>Not a JD ?</span>
                        <Link className="text-blue-900 hover:underline" to={'/sign-up'}>Sign-up</Link>
                    </div>
                    {
                        data && data.statusCode != 200 && <Alert className="mt-4" color={'failure'}>
                            {data?.message}
                        </Alert>
                    }
                </div>
            </div>
        </div>
    )
}

export const signinAction = async ({ request }) => {
    const data = await request.formData();
    const authData = {
        email: data.get('email'),
        password: data.get('password')
    }
    const response = await fetch('/jd/auth/signin', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
    });

    return response
}