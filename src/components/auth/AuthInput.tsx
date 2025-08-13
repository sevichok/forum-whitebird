import { InputHTMLAttributes } from "react";

type TInputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

const AuthInput = ({ label, ...rest }: TInputProps) => (
    <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">{label}</label>
        <input
            {...rest}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default AuthInput
