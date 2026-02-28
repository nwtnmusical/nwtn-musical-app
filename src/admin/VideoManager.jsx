import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    thumbnail: ''
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const videosQuery = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(videosQuery);
    const videosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVideos(videosData);
  };

  // Extract YouTube video ID and generate thumbnail
  const getYouTubeThumbnail = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return {
      videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { videoId, thumbnail } = getYouTubeThumbnail(formData.youtubeUrl);
      
      const videoData = {
        title: formData.title,
        youtubeUrl: formData.youtubeUrl,
        videoId: videoId,
        description: formData.description,
        thumbnail: thumbnail,
        views: editingVideo?.views || 0,
        createdAt: editingVideo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingVideo) {
        await updateDoc(doc(db, 'videos', editingVideo.id), videoData);
      } else {
        await addDoc(collection(db, 'videos'), videoData);
      }

      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Error saving video. Please check the YouTube URL.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await deleteDoc(doc(db, 'videos', id));
      fetchVideos();
    }
  };

  const resetForm = () => {
    setFormData({ title: '', youtubeUrl: '', description: '' });
    setEditingVideo(null);
    setShowForm(false);
  };

  const editVideo = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      description: video.description || ''
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#a51502]">Manage Videos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#d12200] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#a51502]"
        >
          <Plus size={20} /> Add New Video
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#d12200]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube URL *</label>
              <input
                type="url"
                required
                placeholder="https://youtube.com/watch?v=..."
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#d12200]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#d12200]"
                rows="3"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#d12200] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#a51502]"
              >
                <Save size={20} /> Save Video
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-400"
              >
                <X size={20} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{video.description}</p>
              <p className="text-xs text-gray-500 mb-3">{video.views || 0} views</p>
              <div className="flex gap-2">
                <button
                  onClick={() => editVideo(video)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoManager;
