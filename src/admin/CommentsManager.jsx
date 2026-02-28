import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MessageCircle, Trash2, Check, X } from 'lucide-react';

const CommentsManager = () => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [showReplyBox, setShowReplyBox] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const commentsQuery = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(commentsQuery);
    const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Fetch replies for each comment
    const repliesData = {};
    for (const comment of commentsData) {
      const repliesQuery = query(collection(db, 'comments', comment.id, 'replies'), orderBy('createdAt', 'asc'));
      const repliesSnapshot = await getDocs(repliesQuery);
      repliesData[comment.id] = repliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    setComments(commentsData);
    setReplies(repliesData);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      await deleteDoc(doc(db, 'comments', commentId));
      fetchComments();
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;

    await addDoc(collection(db, 'comments', commentId, 'replies'), {
      text: replyText,
      createdAt: new Date().toISOString(),
      isAdmin: true
    });

    setShowReplyBox(null);
    fetchComments();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#a51502] mb-6">Manage Comments</h1>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#f8c5c0] rounded-full flex items-center justify-center">
                    <span className="text-[#d12200] font-semibold">
                      {comment.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{comment.name}</p>
                    <p className="text-xs text-gray-500">{comment.email}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-2">{comment.text}</p>
                
                {comment.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Replies */}
            {replies[comment.id]?.length > 0 && (
              <div className="ml-8 mt-4 space-y-3">
                {replies[comment.id].map(reply => (
                  <div key={reply.id} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-700">{reply.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(reply.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply box */}
            {showReplyBox === comment.id ? (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows="2"
                  placeholder="Write your reply..."
                  id={`reply-${comment.id}`}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      const text = document.getElementById(`reply-${comment.id}`).value;
                      handleAddReply(comment.id, text);
                    }}
                    className="bg-[#d12200] text-white px-3 py-1 rounded text-sm hover:bg-[#a51502]"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setShowReplyBox(null)}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowReplyBox(comment.id)}
                className="mt-2 text-sm text-[#d12200] hover:underline flex items-center gap-1"
              >
                <MessageCircle size={16} /> Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsManager;
