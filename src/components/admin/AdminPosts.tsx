import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Button, ConfirmModal, Toast } from '../common';
import { TPost, TToastProps } from '../../helpers/types';

const AdminPosts = () => {
    const currentUser = auth.currentUser;

    const [posts, setPosts] = useState<TPost[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<TToastProps | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<'save' | 'delete' | null>(null);
    const [selectedPost, setSelectedPost] = useState<TPost | null>(null);

    const handlePostChange = (id: string, value: number) => {
        setPosts(prev => prev.map(p => (p.id === id ? { ...p, priority: value } : p)));
    };

    const handleSavePost = (post: TPost) => {
        setSelectedPost(post);
        setConfirmType('save');
        setConfirmOpen(true);
    };

    const handleDeletePost = (post: TPost) => {
        setSelectedPost(post);
        setConfirmType('delete');
        setConfirmOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedPost) return;

        try {
            if (confirmType === 'save') {
                await updateDoc(doc(db, 'posts', selectedPost.id), {
                    priority: selectedPost.priority ?? null,
                });
                setToast({ message: 'Приоритет поста обновлен', type: 'success' });
            }
            if (confirmType === 'delete') {
                await deleteDoc(doc(db, 'posts', selectedPost.id));
                setToast({ message: 'Пост удалён', type: 'success' });
            }
        } catch {
            setToast({
                message: confirmType === 'delete'
                    ? 'Ошибка при удалении поста'
                    : 'Ошибка при сохранении поста',
                type: 'error',
            });
        }

        setConfirmOpen(false);
        setSelectedPost(null);
        setConfirmType(null);
    };

    useEffect(() => {
        if (!currentUser) return;

        const unsub = onSnapshot(
            query(collection(db, 'posts')),
            snapshot => {
                const sortedPosts = snapshot.docs
                    .map(doc => ({ id: doc.id, ...(doc.data() as Omit<TPost, 'id'>) }))
                    .sort((a, b) => {
                        const priorityDiff =
                            (a.priority ?? Infinity) - (b.priority ?? Infinity);
                        if (priorityDiff !== 0) return priorityDiff;
                        return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
                    });
                setPosts(sortedPosts);
                setLoadingPosts(false);
            },
            () => {
                setError('Ошибка загрузки постов');
                setLoadingPosts(false);
            }
        );

        return unsub;
    }, [currentUser]);

    return (
        <section>
            <h1 className="text-3xl font-semibold text-center mb-4">
                Админ-панель: Посты
            </h1>

            {loadingPosts && <p className="text-center text-gray-500">Загрузка...</p>}
            {!loadingPosts && posts.length === 0 && (
                <p className="text-center text-gray-500">Постов нет</p>
            )}
            {!loadingPosts && posts.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Заголовок</th>
                            <th className="border p-2 text-left">Приоритет</th>
                            <th className="border p-2 text-center">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td className="border p-2">{post.text}</td>
                                <td className="border p-2">
                                    <input
                                        className="border rounded p-1 w-24"
                                        type="number"
                                        value={post.priority ?? ''}
                                        onChange={e =>
                                            handlePostChange(post.id, Number(e.target.value))
                                        }
                                    />
                                </td>
                                <td className="border p-2 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                            onClick={() => handleSavePost(post)}
                                        >Сохранить
                                        </Button>
                                        <Button
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            onClick={() => handleDeletePost(post)}
                                        >Удалить
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title={
                    confirmType === 'delete'
                        ? 'Подтвердите удаление'
                        : 'Подтвердите сохранение'
                }
                message={
                    confirmType === 'delete'
                        ? `Удалить пост "${selectedPost?.text}"?`
                        : `Сохранить приоритет поста "${selectedPost?.text}"?`
                }
                onConfirm={confirmAction}
                onCancel={() => setConfirmOpen(false)}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </section>
    );
};

export default AdminPosts;
