import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all documents
  const fetchAll = async (orderByField = 'createdAt', order = 'desc') => {
    setLoading(true);
    try {
      const q = query(
        collection(db, collectionName),
        orderBy(orderByField, order)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docs);
      return docs;
    } catch (err) {
      setError(err.message);
      toast.error(`Error fetching ${collectionName}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch with filters
  const fetchWithFilters = async (filters = [], orderByField = 'createdAt', order = 'desc', limitCount = null) => {
    setLoading(true);
    try {
      let constraints = [];
      
      filters.forEach(filter => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
      
      constraints.push(orderBy(orderByField, order));
      
      if (limitCount) {
        constraints.push(limit(limitCount));
      }
      
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setDocuments(docs);
      return docs;
    } catch (err) {
      setError(err.message);
      toast.error(`Error fetching ${collectionName}`);
    } finally {
      setLoading(false);
    }
  };

  // Add document
  const add = async (data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast.success('Added successfully');
      return { success: true, id: docRef.id };
    } catch (err) {
      setError(err.message);
      toast.error(`Error adding to ${collectionName}`);
      return { success: false, error: err.message };
    }
  };

  // Update document
  const update = async (id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      toast.success('Updated successfully');
      return { success: true };
    } catch (err) {
      setError(err.message);
      toast.error(`Error updating ${collectionName}`);
      return { success: false, error: err.message };
    }
  };

  // Delete document
  const remove = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success('Deleted successfully');
      return { success: true };
    } catch (err) {
      setError(err.message);
      toast.error(`Error deleting from ${collectionName}`);
      return { success: false, error: err.message };
    }
  };

  return {
    documents,
    loading,
    error,
    fetchAll,
    fetchWithFilters,
    add,
    update,
    remove
  };
};
