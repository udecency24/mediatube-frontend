import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaVideo, FaEye, FaStar, FaComment, FaPlus } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const CreatorDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for videos
  // In a real app, this would come from an API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setVideos([
            {
              id: 1,
              title: "Introduction to React",
              uploadDate: "2023-05-01T12:00:00Z",
              viewCount: 1245,
              likeCount: 89,
              commentCount: 17,
              averageRating: 4.5,
              thumbnailUrl: "https://via.placeholder.com/320x180?text=React",
            },
            {
              id: 2,
              title: "Node.js Crash Course",
              uploadDate: "2023-04-15T14:30:00Z",
              viewCount: 876,
              likeCount: 56,
              commentCount: 8,
              averageRating: 4.2,
              thumbnailUrl: "https://via.placeholder.com/320x180?text=Node.js",
            },
            {
              id: 3,
              title: "Building a MERN Stack App",
              uploadDate: "2023-03-22T09:15:00Z",
              viewCount: 2134,
              likeCount: 145,
              commentCount: 23,
              averageRating: 4.7,
              thumbnailUrl: "https://via.placeholder.com/320x180?text=MERN",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load videos");
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If not a creator, show error message
  if (user?.role !== "creator" && user?.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Creator Access Required</h1>
        <p className="text-gray-600 mb-6">
          This dashboard is only available to content creators.
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="creator-dashboard">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-gray-600">
            Manage your videos and track performance
          </p>
        </div>

        <Link
          to="/upload"
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> Upload New Video
        </Link>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Total Videos</h3>
            <FaVideo className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold mt-2">{videos.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Total Views</h3>
            <FaEye className="text-green-600" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {videos
              .reduce((sum, video) => sum + video.viewCount, 0)
              .toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Average Rating</h3>
            <FaStar className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {(
              videos.reduce((sum, video) => sum + video.averageRating, 0) /
              videos.length
            ).toFixed(1)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Total Comments</h3>
            <FaComment className="text-purple-600" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {videos.reduce((sum, video) => sum + video.commentCount, 0)}
          </p>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-medium p-6 border-b">Your Videos</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {videos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-16 h-9 object-cover rounded mr-3"
                      />
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        {video.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {video.viewCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {video.averageRating} / 5
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {video.commentCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      to={`/video/${video.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      View
                    </Link>
                    <button className="text-gray-600 hover:text-gray-800">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
