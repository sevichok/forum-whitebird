import { useEffect, useState, FC } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { TAdminRouteProps } from '../../helpers/types';

const AdminRoute: FC<TAdminRouteProps> = ({ element }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIsLoading(false);
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'admin') {
          setIsAdmin(true);
        }
      }
      setIsLoading(false);
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default AdminRoute
