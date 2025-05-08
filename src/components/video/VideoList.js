import React from "react";
import VideoCard from "./VideoCard";

const VideoList = ({ videos, loading, error, onLoadMore, hasMore, title }) => {
  if (loading && videos.length === 0) {
    return (
      <div className="grid place-items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-youtube-red"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading videos: {error}</p>
        <button
          onClick={onLoadMore}
          className="mt-4 px-4 py-2 bg-youtube-red text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No videos found.</p>
      </div>
    );
  }

  return (
    <div className="video-list">
      {title && <h2 className="text-xl font-bold mb-6">{title}</h2>}

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            className="yt-secondary-button"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoList;
