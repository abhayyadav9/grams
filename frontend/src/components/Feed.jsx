import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Feed = () => {
  const { posts } = useSelector((store) => store.post);

  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-0 md:pl-[20%]'>
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p className="text-gray-500">No posts available</p>
      )}
    </div>
  );
};

export default Feed;
