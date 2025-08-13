type TProps = {
    title: string;
    subtitle: string;
};

const AuthFormHeader = ({ title, subtitle }: TProps) => (
    <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
);

export default AuthFormHeader
