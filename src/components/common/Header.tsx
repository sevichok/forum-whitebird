import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Button, Toast } from '../common';
import { TToastProps } from '../../helpers/types';

const Header = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<TToastProps | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      setToast({
        message: 'Ошибка при выходе',
        type: 'error',
      });
    }
  };

  return (
    <header className="flex justify-between items-center border-b border-gray-200 py-4 px-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">WhiteBird Forum</h1>
      <nav className="flex items-center space-x-6">
        <Link
          to="/home"
          className="text-blue-600 font-semibold hover:underline"
        >
          Главная
        </Link>
        <Link
          to="/profile"
          className="text-blue-600 font-semibold hover:underline"
        >
          Профиль
        </Link>
        <Button variant="danger" onClick={handleLogout}>
          Выйти
        </Button>
      </nav>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </header>
  );
};

export default Header
