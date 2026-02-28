import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import SongManager from './SongManager';
import VideoManager from './VideoManager';
import SettingsManager from './SettingsManager';
import Analytics from './Analytics';
import CommentsManager from './CommentsManager';
import { Music, Video, Settings, BarChart3, MessageCircle, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('songs');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#a51502] text-white min-h-screen p-4">
          <div className="text-2xl font-bold mb-8 text-center">NWTN Admin</div>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('songs')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors ${
                activeTab === 'songs' ? 'bg-[#d12200]' : 'hover:bg-[#cf2100]'
              }`}
            >
              <Music size={20} /> Songs
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors ${
                activeTab === 'videos' ? 'bg-[#d12200]' : 'hover:bg-[#cf2100]'
              }`}
            >
              <Video size={20} /> Videos
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors ${
                activeTab === 'comments' ? 'bg-[#d12200]' : 'hover:bg-[#cf2100]'
              }`}
            >
              <MessageCircle size={20} /> Comments
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'bg-[#d12200]' : 'hover:bg-[#cf2100]'
              }`}
            >
              <BarChart3 size={20} /> Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'bg-[#d12200]' : 'hover:bg-[#cf2100]'
              }`}
            >
              <Settings size={20} /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#cf2100] transition-colors mt-8"
            >
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'songs' && <SongManager />}
          {activeTab === 'videos' && <VideoManager />}
          {activeTab === 'comments' && <CommentsManager />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
