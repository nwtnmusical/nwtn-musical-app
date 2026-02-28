import React, { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import AudioPlayer from 'react-h5-audio-player';

const FeaturedPlayer = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  if (!song) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Album Art */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden shadow-2xl">
          <img
            src={song.thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Player Info */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-accent text-sm mb-2">FEATURED TODAY</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{song.title}</h2>
          <p className="text-accent mb-4">{song.artist}</p>

          {/* Custom Player Controls */}
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition">
              <SkipBack size={24} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white text-primary p-3 rounded-full hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition">
              <SkipForward size={24} />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition">
              <Heart size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-xs">0:00</span>
            <div className="flex-1 h-1 bg-white bg-opacity-30 rounded-full">
              <div className="w-1/3 h-full bg-white rounded-full"></div>
            </div>
            <span className="text-xs">{song.duration || '3:45'}</span>
          </div>
        </div>

        {/* Hidden Audio Player for functionality */}
        <div className="hidden">
          <AudioPlayer
            ref={playerRef}
            src={song.audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedPlayer;
