import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export function useFavorites(postId: string) {
  const user = auth.currentUser;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checkFavorite = async () => {
      const favDoc = await getDoc(doc(db, 'users', user.uid, 'favorites', postId));
      setIsFavorite(favDoc.exists());
    };
    checkFavorite();
  }, [postId, user]);

  const toggleFavorite = async () => {
    if (!user) return;
    const favRef = doc(db, 'users', user.uid, 'favorites', postId);
    if (isFavorite) {
      await deleteDoc(favRef);
      setIsFavorite(false);
    } else {
      await setDoc(favRef, { postId });
      setIsFavorite(true);
    }
  };

  return { isFavorite, toggleFavorite };
}
