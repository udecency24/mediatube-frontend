import React from "react";
import VideoUpload from "../components/video/VideoUpload";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const UploadPage = () => {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If not a creator, show message
  if (user?.role !== "creator" && user?.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Creator Access Required</h1>
        <p className="text-gray-600 mb-6">
          You need a creator account to upload videos. Please upgrade your
          account or contact support.
        </p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Return to Home
        </a>
      </div>
    );
  }

  return (
    <div className="upload-page py-6">
      <VideoUpload />
    </div>
  );
};

export default UploadPage;
