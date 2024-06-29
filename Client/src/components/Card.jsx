import { useQuery } from '@tanstack/react-query';
import { FaRegEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Card({ post }) {

  const { data } = useQuery({
    queryKey: ["AuthorOfthisPost", post.userId],
    queryFn: () => getAuthor(post.userId),
    enabled: Boolean(post)
  })
  
  return (
    <div className='group relative w-full shadow-md border border-sky-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[330px] transition-all'>
      <Link to={`/post-view/${post.slug}`}>
        <img
          src={post.coverImage}
          alt='post cover'
          className='h-[250px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <div className='flex gap-3 items-center justify-start text-sm border-b border-gray-400 pb-2'>
          <img className='w-8 h-8 border border-sky-600 dark:border-sky-300 rounded-full' src={data?.displayPicture} alt="author picture" />
          <Link to={`/@${data?.username}`} className='font-bold hover:underline hover:text-blue-600'>{data?.username}</Link>
        </div>
        <p className='text-lg font-semibold line-clamp-1'>{post.title}</p>
        <div className='flex items-center justify-between'>
          <span className='italic text-sm'>{post.category}</span>
          <div className="flex gap-3 items-center">
            <FaRegEye className="text-xl  text-sky-600 dark:text-sky-400" />
            <span className="text-sm italic">{post && post.View ? post.View.views : post.views} views</span>
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

const getAuthor = async (id) => {
  try {
    const response = await fetch(`/jd/user/getUser?userId=${id}`);
    const resData = await response.json();
    if (!response.ok) {
      throw resData;
    }
    return resData;
  } catch (error) {
    console.error(error);
  }
}