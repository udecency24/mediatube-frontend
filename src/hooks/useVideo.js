import { useState, useEffect, useCallback } from "react";
import { getAllVideos, getVideoById, getVideosByGenre } from "../api/videos";

export const useVideos = (videoId = null, initialLimit = 10, genre = null) => {
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(true);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = genre
        ? await getVideosByGenre(genre, limit, offset)
        : await getAllVideos(limit, offset);

      if (response && Array.isArray(response)) {
        // If we're loading the first page, replace videos. Otherwise, append.
        if (offset === 0) {
          setVideos(response);
        } else {
          setVideos((prevVideos) => [...prevVideos, ...response]);
        }

        // If we got fewer videos than requested, there are no more
        setHasMore(response.length === limit);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, [limit, offset, genre]);

  const fetchSingleVideo = useCallback(async () => {
    if (!videoId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getVideoById(videoId);
      setVideo(response);
    } catch (err) {
      setError(err.message || "Failed to fetch video");
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      fetchSingleVideo();
    } else {
      // Reset offset when genre changes
      setOffset(0);
      fetchVideos();
    }
  }, [videoId, fetchVideos, fetchSingleVideo, genre]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setOffset((prev) => prev + limit);
    }
  };

  // Reset function to go back to page 1
  const resetFilters = () => {
    setOffset(0);
  };

  return {
    videos,
    video,
    loading,
    error,
    hasMore,
    loadMore,
    resetFilters,
    refetch: videoId ? fetchSingleVideo : fetchVideos,
  };
};
