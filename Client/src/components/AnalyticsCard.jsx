import { HiArrowNarrowUp } from 'react-icons/hi'
export default function AnalyticsCard({ icon, title, numbers, lastMonth }) {
    return (
        <div className="group transition-all flex flex-col p-3 gap-4 shadow-md rounded-md w-full md:w-72 dark:bg-slate-800">
            <div className="flex justify-between">
                {icon}
                <div className="flex flex-col items-center">
                    <h3 className="text-gray-500">{title}</h3>
                    <div className='flex gap-4 items-center'>
                        <p className="text-xl italic text-green-700 dark:text-green-400">{numbers}</p>
                        {
                            lastMonth && <div className='flex text-sm items-center text-sky-600 dark:text-sky-400'>
                                    <HiArrowNarrowUp />
                                    {lastMonth}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}