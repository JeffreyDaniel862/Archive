import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsGithub } from 'react-icons/bs'
import FooterContent from "./FooterContent";

export default function FooterComponent() {

    const FOOTER_LINK = [{ title: "Estate", link: "https://github.com/JeffreyDaniel862/Estate" }, { title: "Wealth-Manager", link: "https://github.com/JeffreyDaniel862/Wealth-manager" }];
    const SOCIAL_ACC = [{ title: "Github", link: 'https://github.com/JeffreyDaniel862' }, { title: "Portfolio", link: 'https://jeffreydaniel862.github.io/Portfolio/' }]

    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-4">
                        <Link to={'/'} className='self-center whitespace-nowrap text-lg sm:text-xl dark:text-white font-semibold font-serif'>
                            <span className='px-2 py-1 bg-gradient-to-r from-blue-600 via-sky-500 to-teal-300 rounded-md font-serif text-white'> JD </span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6 mt-4">
                        <div>
                            <FooterContent title={"Projects"} subs={FOOTER_LINK} />
                        </div>
                        <div>
                            <FooterContent title={"Follow us"} subs={SOCIAL_ACC} />
                        </div>
                        <div>
                            <FooterContent title={"Follow us"} subs={SOCIAL_ACC} />
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="/home" by="Jeffrey Daniel" year={new Date().getFullYear()} />
                    <div className="flex gap-6 mt-5 md:mt-0 sm:justify-center">
                        <Footer.Icon href="https://github.com/JeffreyDaniel862/" icon={BsGithub}/>
                    </div>
                </div>
            </div>
        </Footer>
    )
}