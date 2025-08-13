import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Button, ConfirmModal, Toast } from '../common';

type Post = {
    id: string;
    text: string;
    createdAt: any;
};
const ProfilePosts = () => {
    const user = auth.currentUser;

    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [postsError, setPostsError] = useState('');
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchPosts = async () => {
            setLoadingPosts(true);
            setPostsError('');
            try {
                const postsRef = collection(db, 'posts');
                const q = query(postsRef, where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const userPosts: Post[] = [];
                querySnapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    userPosts.push({
                        id: docSnap.id,
                        text: data.text,
                        createdAt: data.createdAt,
                    });
                });
                setPosts(userPosts);
            } catch (e) {
                setPostsError('Не удалось загрузить посты');
            } finally {
                setLoadingPosts(false);
            }
        };
        fetchPosts();
    }, [user]);


    const confirmDeletePost = async () => {
        if (!postToDelete) return;
        try {
            await deleteDoc(doc(db, 'posts', postToDelete));
            setPosts(prev => prev.filter(p => p.id !== postToDelete));
            setPostToDelete(null);
            setToast({ message: 'Пост удалён', type: 'success' });
        } catch {
            setToast({ message: 'Ошибка при удалении поста', type: 'error' });
            setPostToDelete(null);
        }
    };

    return (
        <section className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Ваши посты</h2>

            {loadingPosts && <p className="text-center text-gray-500">Загрузка постов...</p>}
            {postsError && <p className="text-center text-red-500">{postsError}</p>}

            {!loadingPosts && posts.length === 0 && (
                <p className="text-center text-gray-500">Постов пока нет...</p>
            )}

            <ul className="space-y-4">
                {posts.map(post => (
                    <li
                        key={post.id}
                        className="border rounded p-4 shadow-sm flex justify-between items-start"
                    >
                        <div>
                            <p className="whitespace-pre-wrap">{post.text}</p>
                            {post.createdAt && (
                                <p className="mt-2 text-xs text-gray-500">
                                    {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="danger"
                            onClick={() => setPostToDelete(post.id)}
                            className="ml-4 self-start"
                        >
                            Удалить
                        </Button>
                    </li>
                ))}
            </ul>

            <ConfirmModal
                isOpen={!!postToDelete}
                title="Подтверждение удаления"
                message="Вы уверены, что хотите удалить этот пост?"
                onConfirm={confirmDeletePost}
                onCancel={() => setPostToDelete(null)}
                confirmText="Удалить"
                cancelText="Отмена"
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </section>
    )
}

export default ProfilePosts
