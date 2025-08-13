import { useState, FC } from 'react';
import { Button, Toast } from '../common';
import { TPostFormProps, TToastProps } from '../../helpers/types';

const PostForm: FC<TPostFormProps> = ({ onAddPost }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<TToastProps | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            await onAddPost(text.trim());
            setText('');
            setToast({ message: 'Пост опубликован', type: 'success' });
        } catch {
            setToast({ message: 'Ошибка при публикации поста', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mb-10 px-6">
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Напишите новый пост"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <div className="mt-4 text-right">
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Публикация' : 'Опубликовать'}
                    </Button>
                </div>
            </form>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default PostForm
