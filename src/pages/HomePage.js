import React from "react";
import { useLocation } from "react-router-dom";
import VideoList from "../components/video/VideoList";
import { useVideos } from "../hooks/useVideo";

const HomePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search");

  // Get videos with the custom hook
  const { videos, loading, error, hasMore, loadMore } = useVideos();

  // Filter videos by category or search query if needed

  // Define titles based on current view
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }

    switch (category) {
      case "trending":
        return "Trending Videos";
      case "music":
        return "Music Videos";
      case "movies":
        return "Movie Videos";
      case "gaming":
        return "Gaming Videos";
      case "news":
        return "News Videos";
      case "learning":
        return "Educational Videos";
      default:
        return "Recommended Videos";
    }
  };

  return (
    <div className="home-page">
      <h1 className="text-2xl font-bold mb-6">{getPageTitle()}</h1>

      <VideoList
        videos={videos}
        loading={loading}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
};

export default HomePage;
