import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Music, Video, Users, Eye, ThumbsUp } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalVideos: 0,
    totalPlays: 0,
    totalViews: 0,
    totalComments: 0,
    totalRatings: 0
  });
  const [popularSongs, setPopularSongs] = useState([]);
  const [popularVideos, setPopularVideos] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch songs
      const songsSnapshot = await getDocs(collection(db, 'songs'));
      const songs = songsSnapshot.docs.map(doc => doc.data());
      
      // Fetch videos
      const videosSnapshot = await getDocs(collection(db, 'videos'));
      const videos = videosSnapshot.docs.map(doc => doc.data());
      
      // Fetch comments
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      const comments = commentsSnapshot.docs.map(doc => doc.data());
      
      // Fetch ratings
      const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
      const ratings = ratingsSnapshot.docs.map(doc => doc.data());

      // Calculate totals
      const totalPlays = songs.reduce((acc, song) => acc + (song.plays || 0), 0);
      const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);

      setStats({
        totalSongs: songs.length,
        totalVideos: videos.length,
        totalPlays,
        totalViews,
        totalComments: comments.length,
        totalRatings: ratings.length
      });

      // Get popular songs
      const popularSongsData = songsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.plays || 0) - (a.plays || 0))
        .slice(0, 5);
      setPopularSongs(popularSongsData);

      // Get popular videos
      const popularVideosData = videosSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);
      setPopularVideos(popularVideosData);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const COLORS = ['#d12200', '#a51502', '#f8c5c0', '#cf2100'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#a51502]">Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Songs</p>
              <p className="text-3xl font-bold text-[#d12200]">{stats.totalSongs}</p>
            </div>
            <Music size={40} className="text-[#f8c5c0]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Videos</p>
              <p className="text-3xl font-bold text-[#d12200]">{stats.totalVideos}</p>
            </div>
            <Video size={40} className="text-[#f8c5c0]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Plays</p>
              <p className="text-3xl font-bold text-[#d12200]">{stats.totalPlays}</p>
            </div>
            <Eye size={40} className="text-[#f8c5c0]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Engagement</p>
              <p className="text-3xl font-bold text-[#d12200]">
                {stats.totalComments + stats.totalRatings}
              </p>
            </div>
            <Users size={40} className="text-[#f8c5c0]" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Popular Songs</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularSongs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="plays" fill="#d12200" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Content Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Songs', value: stats.totalSongs },
                  { name: 'Videos', value: stats.totalVideos }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popular Content Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top 5 Songs</h2>
          <div className="space-y-3">
            {popularSongs.map((song, index) => (
              <div key={song.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded" />
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-gray-500">{song.artist}</p>
                  </div>
                </div>
                <span className="font-semibold text-[#d12200]">{song.plays || 0} plays</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top 5 Videos</h2>
          <div className="space-y-3">
            {popularVideos.map((video, index) => (
              <div key={video.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <img src={video.thumbnail} alt={video.title} className="w-10 h-10 rounded" />
                  <p className="font-medium">{video.title}</p>
                </div>
                <span className="font-semibold text-[#d12200]">{video.views || 0} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
