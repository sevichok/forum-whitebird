import { ButtonHTMLAttributes, FC } from 'react';

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'danger';
};

const Button: FC<TButtonProps> = ({
    variant = 'primary',
    className = '',
    children,
    ...props
}) => {
    const baseClasses = "rounded-md px-4 py-2 font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button
