import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Heart, Volume2, MoreHorizontal } from 'lucide-react';
import { incrementPlayCount } from '../utils/analytics';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const SongCard = ({ song, featured = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef(null);

  // Anti-download measures
  useEffect(() => {
    const audio = playerRef.current?.audio?.current;
    if (audio) {
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      audio.addEventListener('dragstart', (e) => e.preventDefault());
    }
  }, [showPlayer]);

  const handlePlay = async () => {
    setIsPlaying(true);
    await incrementPlayCount(song.id, 'song');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Save to user's liked songs
  };

  return (
    <div className={`card ${featured ? 'col-span-2 row-span-2' : ''}`}>
      <div className="relative group">
        <img
          src={song.thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'}
          alt={song.title}
          className={`w-full object-cover ${featured ? 'h-64' : 'h-48'}`}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            className="bg-primary text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-secondary"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>

        {/* Duration Badge */}
        <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {song.duration || '3:45'}
        </span>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link to={`/songs/${song.id}`}>
              <h3 className="font-semibold text-lg text-secondary hover:text-primary transition-colors">
                {song.title}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm">{song.artist}</p>
          </div>
          <button
            onClick={handleLike}
            className={`transition-colors ${isLiked ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
          >
            <Heart size={20} fill={isLiked ? '#d12200' : 'none'} />
          </button>
        </div>

        {showPlayer && (
          <div className="mt-4 animate-slide-up">
            <AudioPlayer
              ref={playerRef}
              src={song.audioUrl}
              onPlay={handlePlay}
              showJumpControls={false}
              customProgressBarSection={[]}
              customControlsSection={['MAIN_CONTROLS', 'VOLUME_CONTROLS']}
              autoPlay={false}
              layout="horizontal"
              className="custom-audio-player"
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="text-gray-500">{song.plays?.toLocaleString() || 0} plays</span>
          <span className="text-gray-400">{song.album || 'Single'}</span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
