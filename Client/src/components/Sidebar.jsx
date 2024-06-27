import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiChartPie, HiCollection   } from 'react-icons/hi'
import { Link } from 'react-router-dom';

export default function SideTab({ tab }) {
    return (
        <div>
            <Sidebar className='w-full md:w-56 md:h-screen'>
                <Sidebar.Items>
                    <Sidebar.ItemGroup className='flex flex-col gap-1'>
                        <Link to={'/dashboard?tab=analytics'}>
                            <Sidebar.Item active={tab == 'analytics'} icon={HiChartPie } as='div'>
                                Analytics
                            </Sidebar.Item>
                        </Link>
                        <Link to={'/dashboard?tab=profile'}>
                            <Sidebar.Item active={tab == 'profile'} icon={HiUser} label={'User'} labelColor={'dark'} as='div'>
                                Profile
                            </Sidebar.Item>
                        </Link>
                        <Link to={'/dashboard?tab=posts'}>
                            <Sidebar.Item active={tab == 'posts'} icon={HiDocumentText} as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                        <Link to={'/dashboard?tab=collections'}>
                            <Sidebar.Item active={tab == 'collections'} icon={HiCollection} as='div'>
                                Collections
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