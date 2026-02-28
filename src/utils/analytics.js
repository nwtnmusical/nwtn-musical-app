import { doc, updateDoc, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const incrementPlayCount = async (contentId, contentType) => {
  try {
    const docRef = doc(db, contentType === 'song' ? 'songs' : 'videos', contentId);
    await updateDoc(docRef, {
      plays: increment(1)
    });

    // Log activity for analytics
    await addDoc(collection(db, 'analytics'), {
      contentType,
      contentId,
      action: 'play',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error incrementing play count:', error);
  }
};

export const trackUserAction = async (action, details = {}) => {
  try {
    await addDoc(collection(db, 'userActions'), {
      action,
      ...details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error tracking user action:', error);
  }
};
