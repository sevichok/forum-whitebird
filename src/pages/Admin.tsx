import { auth } from '../firebase/config';
import { Header } from '../components/common';
import { AdminUsers, AdminPosts } from '../components/admin';


const AdminPage = () => {
  const currentUser = auth.currentUser;

  if (!currentUser)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Пользователь не авторизован</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto p-6 flex flex-col gap-12">
        <AdminUsers />
        <AdminPosts />
      </main>
    </div>
  );
};


export default AdminPage;
