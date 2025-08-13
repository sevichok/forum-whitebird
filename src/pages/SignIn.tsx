import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthFormHeader, AuthInput, AuthModalLayout, AuthSubmitButton } from "../components/auth";

const SigninPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || 'auth/invalid-credential') {
        navigate('/signup');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <AuthModalLayout>
      <form onSubmit={handleSignIn}>
        <AuthFormHeader
          title="Войдите в аккаунт"
          subtitle="Введите данные ниже"
        />

        <AuthInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <AuthInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="mt-6">
          <AuthSubmitButton text="Войти" />
        </div>
      </form>
      <div className="mt-4 text-center text-sm text-gray-500">
        Нет аккаунта?{' '}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Зарегистрируйтесь
        </Link>
      </div>
    </AuthModalLayout>
  );
};

export default SigninPage;
