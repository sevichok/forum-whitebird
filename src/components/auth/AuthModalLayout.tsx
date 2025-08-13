import { ReactNode } from "react";

type TModalLayotProps = {
    children: ReactNode;
};

const AuthModalLayout = ({ children }: TModalLayotProps) => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            {children}
        </div>
    </div>
);

export default AuthModalLayout
