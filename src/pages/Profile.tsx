import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  doc,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Header } from '../components/common';
import { ProfileEdit, ProfilePosts } from '../components/profile';

const Profile = () => {
  const user = auth.currentUser;

  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        setError('Ошибка при получении роли пользователя:');
      }
    };

    fetchUserRole();
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Пользователь не авторизован</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto flex flex-col">
        {isAdmin && <section className="pt-6">
          <div className="flex justify-center">
            <Link
              to="/admin"
              className="text-blue-600 font-semibold hover:underline"
            >
              Администратор
            </Link>
          </div>
        </section>}
        <ProfileEdit />
        <ProfilePosts />
      </main>
    </div>
  );
};

export default Profile;
