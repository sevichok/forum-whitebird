import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthFormHeader, AuthInput, AuthModalLayout, AuthSubmitButton } from "../components/auth";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthModalLayout>
      <form onSubmit={handleSignUp}>
        <AuthFormHeader
          title="Создайте аккаунт"
          subtitle="Зарегистрируйтесь"
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
        <AuthInput
          label="Confirm Password"
          type="password"
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="mt-6">
          <AuthSubmitButton text="Регистрация" />
        </div>
      </form>
      <div className="mt-4 text-center text-sm text-gray-500">
        Есть аккаунт?{' '}
        <Link to="/signin" className="text-blue-500 hover:underline">
          Войдите
        </Link>
      </div>
    </AuthModalLayout>
  );
};

export default SignupPage;
