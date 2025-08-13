import { useState, useMemo, FC } from 'react';
import PostItem from './PostItem';
import { TPostsListProps } from '../../helpers/types';


const PostsList: FC<TPostsListProps> = ({ posts, currentUser, onPostDeleted }) => {
  const [filterUserId, setFilterUserId] = useState('all');

  const userOptions = useMemo(() => [
    { id: 'all', name: 'Все' },
    ...Array.from(new Map(
      posts.map(p => [p.userId, p.userName || p.userId])
    ), ([id, name]) => ({ id, name }))
  ], [posts]);

  const filteredPosts = useMemo(
    () => filterUserId === 'all' ? posts : posts.filter(p => p.userId === filterUserId),
    [posts, filterUserId]
  );

  if (!posts.length) {
    return <p className="text-center text-gray-500 mt-8">Постов пока нет...</p>;
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-4">
      <div className="mb-6">
        <label className="flex flex-col max-w-xs">
          <span className="font-semibold mb-1 text-gray-700">Фильтр по пользователю</span>
          <select
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filterUserId}
            onChange={e => setFilterUserId(e.target.value)}
          >
            {userOptions.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </label>
      </div>

      {filteredPosts.length
        ? filteredPosts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            currentUser={currentUser}
            onPostDeleted={onPostDeleted}
          />
        ))
        : <p className="text-center text-gray-500">Посты по фильтру не найдены</p>
      }
    </section>
  );
};

export default PostsList
