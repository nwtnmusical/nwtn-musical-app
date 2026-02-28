import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const CommentSection = ({ contentId, contentType }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [contentId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const commentsQuery = query(
        collection(db, 'comments'),
        where('contentId', '==', contentId),
        where('contentType', '==', contentType),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(commentsQuery);
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim() || !userEmail.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        text: newComment.trim(),
        name: userName.trim(),
        email: userEmail.trim(),
        contentId,
        contentType,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'comments'), commentData);
      
      setNewComment('');
      toast.success('Comment posted successfully!');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
        <MessageCircle /> Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your Name *"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="email"
            placeholder="Your Email *"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="flex gap-2">
          <textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="input-field"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary px-6 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">
                    {comment.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-secondary">{comment.name}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
