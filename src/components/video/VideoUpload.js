import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { uploadVideo } from "../../api/videos";

const ageRatings = ["G", "PG", "PG-13", "R", "NC-17"];
const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Documentary",
  "Horror",
  "Sci-Fi",
  "Fantasy",
  "Romance",
  "Thriller",
  "Animation",
  "Educational",
  "Music",
  "Sports",
  "News",
  "Other",
];

const VideoUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    producer: "",
    genre: "",
    ageRating: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (!validVideoTypes.includes(file.type)) {
      setError("Please select a valid video file (MP4, WebM, Ogg)");
      return;
    }

    // Check file size (limit to 100MB for example)
    if (file.size > 100 * 1024 * 1024) {
      setError("File size should not exceed 100MB");
      return;
    }

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validVideoTypes.includes(file.type)) {
        setError("Please drop a valid video file (MP4, WebM, Ogg)");
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError("File size should not exceed 100MB");
        return;
      }

      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setError("Please select a video file");
      return;
    }

    const requiredFields = [
      "title",
      "publisher",
      "producer",
      "genre",
      "ageRating",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);
    setError(null);

    const uploadFormData = new FormData();
    uploadFormData.append("videoFile", videoFile);
    uploadFormData.append("title", formData.title);
    uploadFormData.append("publisher", formData.publisher);
    uploadFormData.append("producer", formData.producer);
    uploadFormData.append("genre", formData.genre);
    uploadFormData.append("ageRating", formData.ageRating);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      const response = await uploadVideo(uploadFormData);

      clearInterval(progressInterval);
      setProgress(100);

      // Redirect to the new video page
      setTimeout(() => {
        navigate(`/video/${response.id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload video");
      setLoading(false);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      publisher: "",
      producer: "",
      genre: "",
      ageRating: "",
    });
    setVideoFile(null);
    setPreviewUrl("");
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center
                    ${
                      previewUrl
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-blue-500"
                    }
                    transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />

          {previewUrl ? (
            <div>
              <video
                src={previewUrl}
                controls
                className="max-h-64 mx-auto mb-4"
              />
              <p className="text-green-600 font-medium">
                {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)}{" "}
                MB)
              </p>
            </div>
          ) : (
            <div className="py-8">
              <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-1">
                Drag and drop your video file here
              </p>
              <p className="text-gray-500 text-sm">or click to browse</p>
              <p className="text-gray-500 text-xs mt-2">
                Supported formats: MP4, WebM, Ogg (max 100MB)
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Video Details Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Video Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter video title"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="publisher"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Publisher *
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Media publisher"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="producer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Producer *
              </label>
              <input
                type="text"
                id="producer"
                name="producer"
                value={formData.producer}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Content producer"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="ageRating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age Rating *
              </label>
              <select
                id="ageRating"
                name="ageRating"
                value={formData.ageRating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select rating</option>
                {ageRatings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {loading && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Uploading...
              </span>
              <span className="text-sm font-medium text-blue-800">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-blue-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Reset
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            disabled={loading || !videoFile}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Upload Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;
