import { FC, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { TPrivateRouteProps } from '../../helpers/types';

const PrivateRoute: FC<TPrivateRouteProps> = ({ element }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setIsAuth(true);
            } else {
                setIsAuth(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    if (!isAuth) {
        return <Navigate to="/signin" replace />;
    }

    return element;
};

export default PrivateRoute;
