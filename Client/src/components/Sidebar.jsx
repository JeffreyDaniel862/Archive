import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText } from 'react-icons/hi'
import { Link } from 'react-router-dom';

export default function SideTab({ tab }) {
    return (
        <div>
            <Sidebar className='w-full md:w-56 md:h-screen'>
                <Sidebar.Items>
                    <Sidebar.ItemGroup className='flex flex-col gap-1'>
                        <Link to={'/dashboard?tab=profile'}>
                            <Sidebar.Item active={tab == 'profile'} icon={HiUser} label={'User'} labelColor={'dark'} as='div'>
                                Profile
                            </Sidebar.Item>
                        </Link>
                        <Link to={'/dashboard?tab=posts'}>
                            <Sidebar.Item active={tab == 'posts'} icon={HiDocumentText} label={'Posts'} labelColor={'dark'} as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                        <Sidebar.Item icon={HiArrowSmRight}>
                            Sign-Out
                        </Sidebar.Item>
                        <Sidebar.Item />
                    </Sidebar.ItemGroup>
                </Sidebar.Items>       
            </Sidebar>
        </div>
    )
}