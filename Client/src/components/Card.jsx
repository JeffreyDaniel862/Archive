import { FaRegEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Card({ post }) {
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[330px] transition-all'>
      <Link to={`/post-view/${post.slug}`}>
        <img
          src={post.coverImage}
          alt='post cover'
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <div className='flex items-center justify-between'>
          <span className='italic text-sm'>{post.category}</span>
          <div className="flex gap-3 items-center">
            <FaRegEye className="text-xl  text-sky-600 dark:text-sky-400" />
            <span className="text-sm italic">{post && post.View.views} views</span>
          </div>
        </div>
        <Link
          to={`/post-view/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}