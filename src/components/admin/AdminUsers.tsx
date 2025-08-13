import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { TToastProps, TUser } from '../../helpers/types';
import { Button, ConfirmModal, Toast } from '../common';

const AdminUsers = () => {
    const currentUser = auth.currentUser;
    const [users, setUsers] = useState<TUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<TToastProps | null>(null);
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        const unsub = onSnapshot(
            collection(db, 'users'),
            snapshot => {
                setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<TUser, 'id'>) })));
                setLoading(false);
            },
            () => {
                setError('Ошибка загрузки пользователей');
                setLoading(false);
            }
        );
        return () => unsub();
    }, [currentUser]);

    const handleChange = (id: string, field: keyof Omit<TUser, 'id'>, value: string) =>
        setUsers(prev => prev.map(user => (user.id === id ? { ...user, [field]: value } : user)));

    const handleSaveClick = (user: TUser) => {
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const confirmSave = async () => {
        if (!selectedUser) return;
        try {
            await updateDoc(doc(db, 'users', selectedUser.id), {
                name: selectedUser.name,
                email: selectedUser.email,
            });
            setToast({ message: 'Пользователь успешно обновлен', type: 'success' });
        } catch {
            setToast({ message: 'Ошибка при сохранении пользователя', type: 'error' });
        }
        setConfirmOpen(false);
        setSelectedUser(null);
    };

    if (!currentUser) return null;

    return (
        <section>
            <h1 className="text-3xl font-semibold text-center mb-4">Админ-панель: Пользователи</h1>
            {loading && <p className="text-center text-gray-500">Загрузка пользователей...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && users.length === 0 && <p className="text-center text-gray-500">Пользователей пока нет.</p>}
            {!loading && users.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Имя</th>
                            <th className="border p-2 text-left">Email</th>
                            <th className="border p-2 text-center">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="border p-2">
                                    <input
                                        className="border rounded p-1 w-full"
                                        type="text"
                                        value={user.name}
                                        onChange={e => handleChange(user.id, 'name', e.target.value)}
                                    />
                                </td>
                                <td className="border p-2">
                                    <input
                                        className="border rounded p-1 w-full"
                                        type="email"
                                        value={user.email}
                                        onChange={e => handleChange(user.id, 'email', e.target.value)}
                                    />
                                </td>
                                <td className="border p-2 text-center">
                                    <Button onClick={() => handleSaveClick(user)}>Сохранить</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title="Подтвердите сохранение"
                message={`Сохранить изменения пользователя "${selectedUser?.name}"?`}
                onConfirm={confirmSave}
                onCancel={() => setConfirmOpen(false)}
                confirmText="Сохранить"
                cancelText="Отмена"
            />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </section>
    );
}

export default AdminUsers
