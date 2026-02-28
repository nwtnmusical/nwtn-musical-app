import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video }) => {
  return (
    <div className="card group">
      <div className="relative">
        <img
          src={video.thumbnail || 'https://img.youtube.com/vi/default/maxresdefault.jpg'}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/videos/${video.id}`}
            className="bg-primary text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-secondary"
          >
            <Play size={20} fill="white" />
          </Link>
        </div>

        {/* Duration Badge */}
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {video.duration || '3:45'}
        </span>
      </div>

      <div className="p-4">
        <Link to={`/videos/${video.id}`}>
          <h3 className="font-semibold text-lg text-secondary hover:text-primary transition-colors line-clamp-2 mb-2">
            {video.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{video.views?.toLocaleString() || 0} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>
              {video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : 'Recently'}
            </span>
          </div>
        </div>

        {video.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
