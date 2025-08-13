import { useEffect, FC } from 'react';
import { TToastProps } from '../../helpers/types';
import { ToastColors } from '../../helpers/constants';

type ToastProps = TToastProps & {
    onClose: () => void;
    duration?: number;
};

const Toast: FC<ToastProps> = ({
    message,
    type = 'success',
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`${ToastColors[type]} text-white px-4 py-2 rounded shadow-lg fixed top-5 right-5 animate-fadeIn`}
        >
            {message}
        </div>
    );
};

export default Toast
