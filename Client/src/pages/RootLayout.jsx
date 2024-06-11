import Footer from '../components/Footer';
import Header from '../components/Header'
import { Outlet } from "react-router-dom";
import ScrollToTop from '../components/ScrollToTop';

export default function RootLayout() {
    return (
        <>
            <Header />
            <ScrollToTop />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}