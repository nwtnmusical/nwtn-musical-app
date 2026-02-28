import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

const SongManager = () => {
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    thumbnail: null,
    audioFile: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const songsQuery = query(collection(db, 'songs'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(songsQuery);
    const songsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSongs(songsData);
  };

  const handleFileUpload = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let thumbnailUrl = editingSong?.thumbnail || '';
      let audioUrl = editingSong?.audioUrl || '';

      // Upload new thumbnail if provided
      if (formData.thumbnail) {
        thumbnailUrl = await handleFileUpload(
          formData.thumbnail,
          `thumbnails/${Date.now()}_${formData.thumbnail.name}`
        );
      }

      // Upload new audio file if provided
      if (formData.audioFile) {
        audioUrl = await handleFileUpload(
          formData.audioFile,
          `songs/${Date.now()}_${formData.audioFile.name}`
        );
      }

      const songData = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album,
        duration: formData.duration,
        thumbnail: thumbnailUrl,
        audioUrl: audioUrl,
        plays: editingSong?.plays || 0,
        createdAt: editingSong?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingSong) {
        // Update existing song
        await updateDoc(doc(db, 'songs', editingSong.id), songData);
      } else {
        // Add new song
        await addDoc(collection(db, 'songs'), songData);
      }

      resetForm();
      fetchSongs();
    } catch (error) {
      console.error('Error saving song:', error);
      alert('Error saving song. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (song) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        // Delete audio file from storage
        if (song.audioUrl) {
          const audioRef = ref(storage, song.audioUrl);
          await deleteObject(audioRef);
        }
        
        // Delete thumbnail from storage
        if (song.thumbnail) {
          const thumbnailRef = ref(storage, song.thumbnail);
          await deleteObject(thumbnailRef);
        }

        // Delete from Firestore
        await deleteDoc(doc(db, 'songs', song.id));
        
        fetchSongs();
      } catch (error) {
        console.error('Error deleting song:', error);
        alert('Error deleting song. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      duration: '',
      thumbnail: null,
      audioFile: null
    });
    setEditingSong(null);
    setShowForm(false);
  };

  const editSong = (song) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      duration: song.duration || '',
      thumbnail: null,
      audioFile: null
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#a51502]">Manage Songs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#d12200] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#a51502]"
        >
          <Plus size={20} /> Add New Song
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingSong ? 'Edit Song' : 'Add New Song'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium mb-1">Artist *</label>
                <input
                  type="text"
                  required
                  value={formData.artist}
                  onChange={(e) => setFormData({...formData, artist: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#d12200]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Album</label>
                <input
                  type="text"
                  value={formData.album}
                  onChange={(e) => setFormData({...formData, album: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#d12200]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="3:45"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#d12200]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.files[0]})}
                  className="w-full p-2 border rounded-lg"
                />
                {editingSong?.thumbnail && !formData.thumbnail && (
                  <p className="text-sm text-gray-500 mt-1">Current thumbnail will be kept</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Audio File (MP3) *</label>
                <input
                  type="file"
                  accept="audio/mpeg"
                  required={!editingSong}
                  onChange={(e) => setFormData({...formData, audioFile: e.target.files[0]})}
                  className="w-full p-2 border rounded-lg"
                />
                {editingSong?.audioUrl && !formData.audioFile && (
                  <p className="text-sm text-gray-500 mt-1">Current audio will be kept</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={uploading}
                className="bg-[#d12200] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#a51502] disabled:opacity-50"
              >
                <Save size={20} /> {uploading ? 'Uploading...' : 'Save Song'}
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

      {/* Songs List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plays</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {songs.map(song => (
              <tr key={song.id}>
                <td className="px-6 py-4">
                  <img src={song.thumbnail || '/default-thumb.jpg'} alt={song.title} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-6 py-4">{song.title}</td>
                <td className="px-6 py-4">{song.artist}</td>
                <td className="px-6 py-4">{song.plays || 0}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => editSong(song)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(song)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongManager;
