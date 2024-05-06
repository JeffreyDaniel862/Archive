import { Footer } from "flowbite-react";

export default function FooterContent({ title, subs }) {
    return (
        <>
            <Footer.Title title={title} />
            <Footer.LinkGroup col>
                {subs.map(sub => <Footer.Link key={sub.link} href={sub.link}>{sub.title}</Footer.Link>)}
            </Footer.LinkGroup>
        </>
    )
}