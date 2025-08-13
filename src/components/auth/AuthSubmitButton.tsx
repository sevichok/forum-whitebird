type TSubmitButtonProps = {
    text: string;
};

const AuthSubmitButton = ({ text }: TSubmitButtonProps) => (
    <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
    >
        {text}
    </button>
);

export default AuthSubmitButton
