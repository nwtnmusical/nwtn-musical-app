import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import SongCard from '../components/SongCard';
import VideoCard from '../components/VideoCard';
import FeaturedPlayer from '../components/FeaturedPlayer';
import { Play, Music, Video } from 'lucide-react';

const HomePage = () => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [featuredSong, setFeaturedSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch recent songs
      const songsQuery = query(collection(db, 'songs'), orderBy('createdAt', 'desc'), limit(6));
      const songsSnapshot = await getDocs(songsQuery);
      const songsData = songsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentSongs(songsData);
      
      if (songsData.length > 0) {
        setFeaturedSong(songsData[0]);
      }

      // Fetch recent videos
      const videosQuery = query(collection(db, 'videos'), orderBy('createdAt', 'desc'), limit(6));
      const videosSnapshot = await getDocs(videosQuery);
      const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentVideos(videosData);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12" style={{ background: 'linear-gradient(135deg, #d12200 0%, #a51502 100%)' }}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">NWTN MUSICAL</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Experience the rhythm of quality music</p>
          <button className="bg-white text-[#d12200] px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
            <Play size={20} fill="#d12200" /> Start Listening
          </button>
        </div>
      </div>

      {/* Featured Player */}
      {featuredSong && <FeaturedPlayer song={featuredSong} />}

      {/* Recent Songs Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#a51502] flex items-center gap-2">
            <Music className="text-[#d12200]" /> Recent Songs
          </h2>
          <a href="/songs" className="text-[#cf2100] hover:underline">View All →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentSongs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Recent Videos Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#a51502] flex items-center gap-2">
            <Video className="text-[#d12200]" /> Music Videos
          </h2>
          <a href="/videos" className="text-[#cf2100] hover:underline">View All →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
