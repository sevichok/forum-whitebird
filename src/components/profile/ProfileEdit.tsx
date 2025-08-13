import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { TToastProps } from '../../helpers/types';
import { Button, Toast } from '../common';

const ProfileEdit = () => {
    const user = auth.currentUser;

    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [loadingName, setLoadingName] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<TToastProps | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchUserName = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.name || '');
                }
            } catch (e) {
                setError('Не удалось загрузить профиль');
            } finally {
                setLoadingName(false);
            }
        };
        fetchUserName();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        try {
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, { name, email });
            setError('');
            setToast({ message: 'Данные успешно сохранены', type: 'success' });
        } catch (e: any) {
            setError(e.message || 'Ошибка при сохранении');
        }
    };
    return (
        <section className="p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center">Ваш профиль</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <label className="block mb-4">
                Имя
                <input
                    type="text"
                    className="border rounded w-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={loadingName ? 'Загрузка...' : name}
                    onChange={e => setName(e.target.value)}
                    disabled={loadingName}
                />
            </label>

            <label className="block mb-6">
                Email
                <input
                    type="email"
                    className="border rounded w-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </label>

            <div className="flex justify-center">
                <Button variant="primary" onClick={handleSave} disabled={loadingName}>
                    Сохранить
                </Button>
            </div>

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

export default ProfileEdit
