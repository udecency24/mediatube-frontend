import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import { formatDate } from "../../utils/formatDate";
import { FaUserCircle, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { getComments } from "../../api/comments";
import Loader from "../common/Loader";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments when the component mounts or videoId changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!videoId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getComments(videoId);
        setComments(response || []);
      } catch (err) {
        setError("Failed to load comments. Please try again later.");
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const commentCount = comments.length;

  if (loading) {
    return (
      <div className="comment-section mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        <div className="flex justify-center py-6">
          <Loader size="medium" color="blue" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comment-section mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="comment-section mt-8">
      <h3 className="text-xl font-bold mb-4">{commentCount} Comments</h3>

      <CommentForm videoId={videoId} onCommentAdded={handleCommentAdded} />

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <div className="flex-shrink-0">
                <FaUserCircle className="w-8 h-8 text-gray-500" />
              </div>

              <div className="flex-grow">
                <div className="flex items-center">
                  <h4 className="font-medium">{comment.username}</h4>
                  <span className="text-gray-500 text-sm ml-2">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                <p className="mt-1 text-gray-800">{comment.comment}</p>

                <div className="flex items-center mt-2 space-x-4">
                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <FaThumbsUp className="mr-1" size={14} />
                    <span className="text-sm">Like</span>
                  </button>

                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <FaThumbsDown className="mr-1" size={14} />
                    <span className="text-sm">Dislike</span>
                  </button>

                  <button className="text-gray-500 hover:text-gray-700 text-sm">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
