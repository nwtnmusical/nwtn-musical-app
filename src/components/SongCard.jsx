import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Heart, Volume2 } from 'lucide-react';
import { incrementPlayCount } from '../utils/analytics';

const SongCard = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Anti-download: Disable context menu and inspect
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
    }
  }, [song.audioUrl]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          await audioRef.current.play();
          await incrementPlayCount(song.id, 'song');
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Playback error:', error);
      }
    }
  };

  // Anti-download: Disable download through keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img 
          src={song.thumbnail || '/default-song.jpg'} 
          alt={song.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => setShowPlayer(!showPlayer)}
          className="absolute bottom-2 right-2 bg-[#d12200] text-white p-3 rounded-full hover:bg-[#a51502] transition-all"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#a51502] mb-1">{song.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{song.artist}</p>
        
        {showPlayer && (
          <div className="mt-3">
            <audio 
              ref={audioRef}
              src={song.audioUrl}
              controls
              className="w-full hidden"
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="flex items-center gap-2">
              <button 
                onClick={togglePlay}
                className="bg-[#f8c5c0] text-[#d12200] p-2 rounded-full hover:bg-[#cf2100] hover:text-white transition-all"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div className="flex-1 h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-[#d12200] rounded-full" 
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <Volume2 size={16} className="text-[#a51502]" />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">{song.plays || 0} plays</span>
          <button className="text-[#cf2100] hover:text-[#d12200]">
            <Heart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
