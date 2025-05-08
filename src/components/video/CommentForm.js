import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { addComment } from "../../api/comments";

const CommentForm = ({ videoId, onCommentAdded }) => {
  const { isAuthenticated, user } = useAuth();
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await addComment(videoId, comment);
      setComment("");

      if (onCommentAdded) {
        // Use the returned comment from the API if available, otherwise create a local version
        if (response && response.id) {
          onCommentAdded(response);
        } else {
          onCommentAdded({
            id: Date.now(), // Temporary ID until refresh
            userId: user.id,
            username: user.username,
            comment,
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">Please sign in to leave a comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <textarea
          rows="3"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setComment("")}
          className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          disabled={submitting || !comment.trim()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={submitting || !comment.trim()}
        >
          {submitting ? "Posting..." : "Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
