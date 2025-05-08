import React, { useState } from "react";
import ReactPlayer from "react-player";
import RatingStars from "./RatingStars";
import { FaThumbsUp, FaThumbsDown, FaShare, FaFlag } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useRating } from "../../hooks/useRating";
import { formatDate } from "../../utils/formatDate";

const VideoPlayer = ({ video }) => {
  const { isAuthenticated } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Use our new rating hook
  const {
    averageRating,
    ratingCount,
    loading: ratingLoading,
    submitRating,
  } = useRating(video?.id);

  if (!video) {
    return (
      <div className="aspect-video bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Loading video...</p>
      </div>
    );
  }

  const handleRating = async (value) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    await submitRating(value);
  };

  // Use our calculated average rating if available, fall back to video object data
  // Ensure it's a number by using Number() or parseFloat()
  const displayRating = Number(averageRating || video.averageRating || 0);
  const displayCount = ratingCount || video.ratingCount || 0;

  return (
    <div className="video-player-container">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <ReactPlayer
          url={video.blobUrl}
          width="100%"
          height="100%"
          controls
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>

      <div className="video-info mt-4">
        <h1 className="text-xl md:text-2xl font-bold mb-2">{video.title}</h1>

        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="text-gray-600">
            <span>{video.viewCount ? `${video.viewCount} views` : "New"}</span>
            <span className="mx-1">•</span>
            <span>{formatDate(video.uploadDate)}</span>
          </div>

          <div className="flex items-center mt-2 md:mt-0">
            <div className="mr-4">
              <RatingStars
                value={displayRating}
                onChange={handleRating}
                disabled={ratingLoading}
              />
              <span className="text-sm text-gray-600 ml-2">
                {/* Make sure we're always dealing with a number before calling toFixed */}
                {typeof displayRating === "number"
                  ? displayRating.toFixed(1)
                  : "0.0"}{" "}
                ({displayCount} ratings)
              </span>
            </div>

            <div className="flex space-x-4">
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <FaThumbsUp className="mr-1" />
                <span className="hidden md:inline">Like</span>
              </button>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <FaThumbsDown className="mr-1" />
                <span className="hidden md:inline">Dislike</span>
              </button>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <FaShare className="mr-1" />
                <span className="hidden md:inline">Share</span>
              </button>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <FaFlag className="mr-1" />
                <span className="hidden md:inline">Report</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-b py-4 border-gray-200 mb-4">
          <div className="flex items-start">
            <div>
              <h3 className="font-medium">Published by {video.publisher}</h3>
              <p className="text-gray-600 text-sm">
                Producer: {video.producer}
              </p>
              <div className="flex items-center mt-2">
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mr-2">
                  {video.genre}
                </span>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                  {video.ageRating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in-down">
          Please login to rate this video
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
