import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, updateDoc, deleteDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ConfirmModal, Toast } from '../common';
import { TPostItemProps, TCommentType, TPostType, TToastProps } from '../../helpers/types';

const PostItem: React.FC<TPostItemProps> = ({ post, currentUser, onPostDeleted }) => {
  const [likes, setLikes] = useState(post.likes ?? []);
  const [dislikes, setDislikes] = useState(post.dislikes ?? []);
  const [favorites, setFavorites] = useState(post.favorites ?? []);
  const [comments, setComments] = useState<TCommentType[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toast, setToast] = useState<TToastProps | null>(null);

  const userId = currentUser?.uid;

  const handleLike = async () => {
    if (!userId) return;

    let newLikes = [...likes];
    let newDislikes = [...dislikes];

    if (likes.includes(userId)) {
      newLikes = newLikes.filter(id => id !== userId);
    } else {
      newLikes.push(userId);
      newDislikes = newDislikes.filter(id => id !== userId);
    }

    setLikes(newLikes);
    setDislikes(newDislikes);

    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, { likes: newLikes, dislikes: newDislikes });
  };

  const handleDislike = async () => {
    if (!userId) return;

    let newLikes = [...likes];
    let newDislikes = [...dislikes];

    if (dislikes.includes(userId)) {
      newDislikes = newDislikes.filter(id => id !== userId);
    } else {
      newDislikes.push(userId);
      newLikes = newLikes.filter(id => id !== userId);
    }

    setLikes(newLikes);
    setDislikes(newDislikes);

    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, { likes: newLikes, dislikes: newDislikes });
  };

  const handleToggleFavorite = async () => {
    if (!userId) return;

    let newFavorites = [...favorites];
    if (favorites.includes(userId)) {
      newFavorites = newFavorites.filter(id => id !== userId);
    } else {
      newFavorites.push(userId);
    }

    setFavorites(newFavorites);

    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, { favorites: newFavorites });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !commentText.trim()) return;

    const commentsRef = collection(db, 'posts', post.id, 'comments');
    await addDoc(commentsRef, {
      userId,
      text: commentText.trim(),
      createdAt: new Date(),
      userName: currentUser.displayName || currentUser.email || 'Anonymous',
    });

    setCommentText('');
  };

  const canDelete = currentUser && (currentUser.uid === post.userId || currentUser.email === 'admin1@gmail.com');

  const openConfirm = () => {
    if (!canDelete) {
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (error) {
      setToast({ message: 'Ошибка при удалении поста', type: 'error' });
    }
  };

  const formatTimestamp = (createdAt: TPostType['createdAt']) => {
    if (!createdAt) return 'Дата недоступна';
    const timestamp = new Timestamp(createdAt.seconds, createdAt.nanoseconds);
    return timestamp.toDate().toLocaleString();
  }

  useEffect(() => {
    const commentsRef = collection(db, 'posts', post.id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedComments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          text: data.text,
          createdAt: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          userName: data.userName || 'Unknown',
        };
      });
      setComments(loadedComments);
      setLoadingComments(false);
    });

    return () => unsubscribe();
  }, [post.id]);

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div>
          <strong>{post.userName || 'Неизвестный пользователь'}</strong>
          <span className="text-gray-500 ml-2 text-sm">{formatTimestamp(post.createdAt)}</span>
        </div>
        {canDelete && (
          <button
            onClick={openConfirm}
            className="mt-2 text-red-400 hover:underline"
          >
            Удалить
          </button>
        )}
      </div>

      <p className="mb-4 whitespace-pre-wrap">
        <Link to={`/posts/${post.id}`} className="hover:underline">
          {post.text}
        </Link>
      </p>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleLike}
          className={`px-2 py-1 rounded ${likes.includes(userId!) ? 'bg-green-200' : 'bg-gray-200'}`}
        >
          👍 {likes.length}
        </button>

        <button
          onClick={handleDislike}
          className={`px-2 py-1 rounded ${dislikes.includes(userId!) ? 'bg-red-200' : 'bg-gray-200'}`}
        >
          👎 {dislikes.length}
        </button>

        <button
          onClick={handleToggleFavorite}
          className={`px-2 py-1 rounded ${favorites.includes(userId!) ? 'bg-yellow-300' : 'bg-gray-200'}`}
        >
          ⭐ {favorites.length}
        </button>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Comments ({comments.length})</h4>

        {loadingComments ? (
          <p>Загрузка комментариев...</p>
        ) : (
          <>
            {comments.length === 0 && <p className="text-gray-500">Нет комментариев еще</p>}

            <ul className="mb-2 max-h-48 overflow-y-auto">
              {comments.map(comment => (
                <li key={comment.id} className="border-b py-1">
                  <strong>{comment.userName || 'Anonymous'}</strong>: {comment.text}
                  <div className="text-xs text-gray-400">{comment.createdAt.toLocaleString()}</div>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddComment} className="flex space-x-2">
              <input
                type="text"
                className="border rounded px-2 py-1 flex-grow"
                placeholder="Оставьте комментарий"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="bg-blue-500 text-white px-4 rounded disabled:bg-gray-300"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
      <ConfirmModal
        isOpen={isConfirmOpen}
        message="Вы действительно хотите удалить этот пост?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default PostItem;
