import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, X } from 'lucide-react';

const SongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [artists, setArtists] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    filterSongs();
  }, [searchTerm, selectedArtist, songs]);

  const fetchSongs = async () => {
    try {
      const songsQuery = query(
        collection(db, 'songs'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(songsQuery);
      const songsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(songsData);
      setFilteredSongs(songsData);

      // Extract unique artists
      const uniqueArtists = [...new Set(songsData.map(song => song.artist))];
      setArtists(uniqueArtists);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSongs = () => {
    let filtered = [...songs];

    if (searchTerm) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedArtist) {
      filtered = filtered.filter(song => song.artist === selectedArtist);
    }

    setFilteredSongs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedArtist('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-20 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            All Songs
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our collection of amazing tracks. From latest releases to timeless classics.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search songs by title or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline flex items-center gap-2 ${
                showFilters ? 'bg-primary text-white' : ''
              }`}
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-lg animate-slide-up mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-secondary flex items-center gap-1"
                >
                  <X size={16} /> Clear All
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Artist</label>
                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Artists</option>
                  {artists.map(artist => (
                    <option key={artist} value={artist}>{artist}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="text-gray-600">
            Showing {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
          </p>
        </div>

        {/* Songs Grid */}
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No songs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongsPage;
