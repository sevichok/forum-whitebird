import { useEffect, useState, FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, orderBy, onSnapshot, query, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { TCommentType, TPostType } from '../helpers/types';

const PostDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const [post, setPost] = useState<TPostType | null>(null);
  const [comments, setComments] = useState<TCommentType[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const postRef = doc(db, 'posts', id);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        setPost({
          id: snap.id,
          ...snap.data(),
        } as TPostType);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const commentsRef = collection(db, 'posts', id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as TCommentType[];
      setComments(loaded);
    });

    return () => unsub();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim() || !id) return;

    const commentsRef = collection(db, 'posts', id, 'comments');
    await addDoc(commentsRef, {
      userId: currentUser.uid,
      text: commentText.trim(),
      createdAt: new Date(),
      userName: currentUser.displayName || currentUser.email || 'Anonymous',
    });

    setCommentText('');
  };

  const formatDate = (createdAt: TPostType['createdAt']) => {
    if (!createdAt) return '';
    const t = new Timestamp(createdAt.seconds, createdAt.nanoseconds);
    return t.toDate().toLocaleString();
  };

  if (!post) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Детали поста</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Назад
        </button>
      </header>

      <div className="border rounded p-4 bg-white shadow-sm">
        <div className="mb-2 text-gray-500 text-sm">
          {post.userName || 'Unknown user'} — {formatDate(post.createdAt)}
        </div>
        <p className="whitespace-pre-wrap">{post.text}</p>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Комментарии ({comments.length})</h2>
        {comments.length === 0 && <p className="text-gray-500">Нет комментариев</p>}
        <ul className="mb-2 max-h-48 overflow-y-auto border rounded p-2">
          {comments.map((c) => (
            <li key={c.id} className="border-b py-1">
              <strong>{c.userName || 'Anonymous'}</strong>: {c.text}
              <div className="text-xs text-gray-400">{c.createdAt.toLocaleString()}</div>
            </li>
          ))}
        </ul>
        {currentUser && (
          <form onSubmit={handleAddComment} className="flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="border rounded px-2 py-1 flex-grow"
              placeholder="Напишите комментарий..."
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-blue-500 text-white px-4 rounded disabled:bg-gray-300"
            >
              Отправить
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostDetail
