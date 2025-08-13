import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  getDoc,
  doc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Header, Toast } from '../components/common';
import { PostForm, PostsList } from '../components/posts';
import { TPost, TToastProps } from '../helpers/types';


const Home = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [toast, setToast] = useState<TToastProps | null>(null);

  const handleAddPost = async (text: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('Пользователь не авторизован');

      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      const userName = userData?.name || 'Unknown';

      await addDoc(collection(db, 'posts'), {
        text,
        userId,
        userName,
        createdAt: serverTimestamp(),
        priority: null,
      });
    } catch (error) {
      setToast({
        message: 'Ошибка при добавлении поста',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts')),
      (snapshot) => {
        const sortedPosts = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as TPost))
          .sort((a, b) => {
            const priorityDiff =
              (a.priority ?? Infinity) - (b.priority ?? Infinity);
            if (priorityDiff !== 0) return priorityDiff;

            return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
          });

        setPosts(sortedPosts);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-6 pb-12 max-w-5xl mx-auto">
        <PostForm onAddPost={handleAddPost} />
        <PostsList posts={posts} currentUser={auth.currentUser} />
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Home;
