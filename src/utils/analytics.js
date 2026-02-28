import { collection, addDoc, increment, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const incrementPlayCount = async (contentId, contentType) => {
  try {
    const docRef = doc(db, contentType === 'song' ? 'songs' : 'videos', contentId);
    await updateDoc(docRef, {
      plays: increment(1)
    });

    // Log to analytics
    await addDoc(collection(db, 'analytics'), {
      type: 'play',
      contentType,
      contentId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error incrementing play count:', error);
  }
};

export const trackView = async (contentId, contentType) => {
  try {
    const docRef = doc(db, contentType === 'song' ? 'songs' : 'videos', contentId);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};

export const trackUserAction = async (action, details = {}) => {
  try {
    await addDoc(collection(db, 'userActions'), {
      action,
      ...details,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error tracking user action:', error);
  }
};
