import { useEffect, useState, FC } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { TCommentsSectionProps, TCommentType } from '../../helpers/types';


const CommentsSection: FC<TCommentsSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<TCommentType[]>([]);
  const [commentText, setCommentText] = useState('');

  const loadComments = async () => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    setComments(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<TCommentType, 'id'>) })));
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!auth.currentUser || !commentText.trim()) return;
    const commentsRef = collection(db, 'posts', postId, 'comments');
    await addDoc(commentsRef, {
      text: commentText,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setCommentText('');
    loadComments();
  };

  return (
    <div className="mt-2">
      <div className="mb-2">
        <input
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Оставьте комментарий..."
          className="border rounded w-full px-2 py-1"
        />
        <button
          onClick={handleAddComment}
          className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Добавить
        </button>
      </div>
      <div>
        {comments.length === 0 ? (
          <p className="text-sm italic">Еще нет комментариев</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="border-b py-1 text-sm">
              <strong>{c.userId}</strong>: {c.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection
