import { Link, useRouteError } from "react-router-dom"
import { FaTimes } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ErrorPage() {

    let error = useRouteError();

    let title = "Error Occured"
    let message = "Something went wrong :("

    if (error) {
        title = error.status ? `Error ${error.status}` : "Error Occurred";
        message = error.data?.message || "Something went wrong"

    }

    return <>
        <Header />
        <main className="w-full flex flex-col p-4 my-7 items-center justify-center">
            <div className="border w-full flex flex-col justify-center items-center p-4 shadow-lg rounded-lg bg-slate-600">
                <Link className="self-start text-3xl text-red-700 transition-all hover:text-red-600 hover:scale-125"><FaTimes /></Link>
                <p className="text-2xl sm:text-4xl text-red-600 my-5">{title}</p>
                <p className="text-lg sm:text-2xl mb-4 text-red-500">{message}</p>
            </div>
        </main>
        <Footer />
    </>
}