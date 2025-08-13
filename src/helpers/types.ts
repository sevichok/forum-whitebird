import { User } from 'firebase/auth';

export type TPost = {
  id: string;
  text: string;
  createdAt: any;
  userId: string;
  likes?: string[];
  dislikes?: string[];
  favorites?: string[];
  userName?: string;
  priority?: number;
};

export type TUser = {
  id: string;
  name: string;
  email: string;
};

export type TToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
};
export type TAdminRouteProps = {
  element: React.ReactElement;
};

export type TPrivateRouteProps = {
  element: React.ReactElement;
};

export type TConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export type TCommentType = {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  userName?: string;
};

export type TCommentsSectionProps = {
  postId: string;
};

export type TPostFormProps = {
  onAddPost: (text: string) => Promise<void>;
};

export type TPostType = {
  id: string;
  userId: string;
  text: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  likes?: string[];
  dislikes?: string[];
  favorites?: string[];
  userName?: string;
  priority?: number;
};

export type TPostItemProps = {
  post: TPostType;
  currentUser: User | null;
  onPostDeleted?: (postId: string) => void;
};

export type TPostsListProps = {
  posts: TPost[];
  currentUser: User | null;
  onPostDeleted?: (postId: string) => void;
};
