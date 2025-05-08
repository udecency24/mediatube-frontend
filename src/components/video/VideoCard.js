import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import defaultThumbnail from "../../thumbnail.png";

const VideoCard = ({ video }) => {
  // Use the local thumbnail image as default instead of via.placeholder.com
  const thumbnailUrl =
    video.thumbnailUrl ||
    defaultThumbnail ||
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngegg.com%2Fen%2Fpng-zksfi&psig=AOvVaw1IhK26IN-wPNv9LNajiL0a&ust=1746801481097000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKj1qOaMlI0DFQAAAAAdAAAAABAT";

  return (
    <div className="video-card">
      <Link to={`/video/${video.id}`} className="block">
        <div className="relative">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="video-card-img"
            onError={(e) => {
              // If the video's thumbnail URL fails, fall back to the default
              if (e.target.src !== defaultThumbnail) {
                e.target.src = defaultThumbnail;
              }
            }}
          />
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
              {video.duration}
            </span>
          )}
        </div>
        <div className="mt-2">
          <h3 className="video-card-title" title={video.title}>
            {video.title}
          </h3>
          <p className="video-card-publisher">{video.publisher}</p>
          <div className="video-card-stats">
            <span>{video.viewCount ? `${video.viewCount} views` : "New"}</span>
            <span className="mx-1">•</span>
            <span>{formatDate(video.uploadDate)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;
