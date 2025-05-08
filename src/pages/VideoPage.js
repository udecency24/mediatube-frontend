import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/video/VideoPlayer";
import CommentSection from "../components/video/CommentSection";
import VideoList from "../components/video/VideoList";
import Loader from "../components/common/Loader";
import { useVideos } from "../hooks/useVideo";

const VideoPage = () => {
  const { id } = useParams();
  const [relatedVideos, setRelatedVideos] = useState([]);

  // Get the current video
  const { video, loading, error, refetch } = useVideos(id);

  // Get videos for the "related videos" section
  const { videos } = useVideos();

  // Filter related videos to exclude the current one and limit to 10
  useEffect(() => {
    if (videos.length > 0 && video) {
      const filtered = videos.filter((v) => v.id !== video.id).slice(0, 10);
      setRelatedVideos(filtered);
    }
  }, [videos, video]);

  // Handle video rating changes
  const handleRatingChange = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="large" color="red" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={refetch} className="yt-primary-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Video not found</p>
      </div>
    );
  }

  return (
    <div className="video-page">
      <div className="video-page-container">
        <div className="video-main-column">
          {/* Video Player */}
          <VideoPlayer video={video} onRatingChange={handleRatingChange} />

          {/* Comments Section */}
          <CommentSection videoId={video.id} comments={video.comments || []} />
        </div>

        <div className="video-sidebar-column">
          {/* Related Videos */}
          <h3 className="text-lg font-medium mb-4">Up next</h3>
          <VideoList
            videos={relatedVideos}
            loading={false}
            error={null}
            hasMore={false}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
