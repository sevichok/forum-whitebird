import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export function useLikes(postId: string) {
  const user = auth.currentUser;
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkLikes = async () => {
      const likeDoc = await getDoc(doc(db, 'posts', postId, 'likes', user.uid));
      const dislikeDoc = await getDoc(
        doc(db, 'posts', postId, 'dislikes', user.uid)
      );
      setIsLiked(likeDoc.exists());
      setIsDisliked(dislikeDoc.exists());
    };

    const countLikes = async () => {
      const likesSnap = await getDocs(collection(db, 'posts', postId, 'likes'));
      setLikesCount(likesSnap.size);
      const dislikesSnap = await getDocs(
        collection(db, 'posts', postId, 'dislikes')
      );
      setDislikesCount(dislikesSnap.size);
    };

    checkLikes();
    countLikes();
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user) return;
    const likeRef = doc(db, 'posts', postId, 'likes', user.uid);
    const dislikeRef = doc(db, 'posts', postId, 'dislikes', user.uid);

    if (isLiked) {
      await deleteDoc(likeRef);
      setIsLiked(false);
    } else {
      await setDoc(likeRef, { userId: user.uid });
      if (isDisliked) {
        await deleteDoc(dislikeRef);
        setIsDisliked(false);
      }
      setIsLiked(true);
    }
    const likesSnap = await getDocs(collection(db, 'posts', postId, 'likes'));
    setLikesCount(likesSnap.size);
    const dislikesSnap = await getDocs(
      collection(db, 'posts', postId, 'dislikes')
    );
    setDislikesCount(dislikesSnap.size);
  };

  const toggleDislike = async () => {
    if (!user) return;
    const dislikeRef = doc(db, 'posts', postId, 'dislikes', user.uid);
    const likeRef = doc(db, 'posts', postId, 'likes', user.uid);

    if (isDisliked) {
      await deleteDoc(dislikeRef);
      setIsDisliked(false);
    } else {
      await setDoc(dislikeRef, { userId: user.uid });
      if (isLiked) {
        await deleteDoc(likeRef);
        setIsLiked(false);
      }
      setIsDisliked(true);
    }
    const likesSnap = await getDocs(collection(db, 'posts', postId, 'likes'));
    setLikesCount(likesSnap.size);
    const dislikesSnap = await getDocs(
      collection(db, 'posts', postId, 'dislikes')
    );
    setDislikesCount(dislikesSnap.size);
  };

  return {
    likesCount,
    dislikesCount,
    isLiked,
    isDisliked,
    toggleLike,
    toggleDislike,
  };
}
