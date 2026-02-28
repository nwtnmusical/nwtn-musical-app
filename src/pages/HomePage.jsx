import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import SongCard from '../components/SongCard';
import VideoCard from '../components/VideoCard';
import FeaturedPlayer from '../components/FeaturedPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import { Play, Music, Video, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [popularSongs, setPopularSongs] = useState([]);
  const [featuredSong, setFeaturedSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch recent songs
      const songsQuery = query(
        collection(db, 'songs'), 
        orderBy('createdAt', 'desc'), 
        limit(8)
      );
      const songsSnapshot = await getDocs(songsQuery);
      const songsData = songsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentSongs(songsData);
      
      if (songsData.length > 0) {
        setFeaturedSong(songsData[0]);
      }

      // Fetch popular songs
      const popularQuery = query(
        collection(db, 'songs'),
        orderBy('plays', 'desc'),
        limit(4)
      );
      const popularSnapshot = await getDocs(popularQuery);
      const popularData = popularSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPopularSongs(popularData);

      // Fetch recent videos
      const videosQuery = query(
        collection(db, 'videos'), 
        orderBy('createdAt', 'desc'), 
        limit(4)
      );
      const videosSnapshot = await getDocs(videosQuery);
      const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentVideos(videosData);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-20 pb-12">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="relative h-[500px] rounded-3xl overflow-hidden mb-12 group">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200"
            alt="Hero"
            className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-secondary opacity-90"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-start p-12 text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-slide-up">
              NWTN MUSICAL
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-slide-up animation-delay-200">
              Experience the rhythm of quality music. Stream the best tracks and videos.
            </p>
            <button className="bg-white text-primary px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform animate-slide-up animation-delay-400">
              <Play size={24} fill="#d12200" /> Start Listening
            </button>
          </div>
        </div>

        {/* Featured Player */}
        {featuredSong && <FeaturedPlayer song={featuredSong} />}

        {/* Recent Songs Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary flex items-center gap-2">
              <Music className="text-primary" /> Recent Releases
            </h2>
            <a href="/songs" className="text-primary hover:text-secondary transition-colors">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        {/* Popular Songs Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary flex items-center gap-2">
              <TrendingUp className="text-primary" /> Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularSongs.map(song => (
              <SongCard key={song.id} song={song} featured />
            ))}
          </div>
        </section>

        {/* Recent Videos Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary flex items-center gap-2">
              <Video className="text-primary" /> Latest Videos
            </h2>
            <a href="/videos" className="text-primary hover:text-secondary transition-colors">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
