import { useState, useEffect } from "react";
import { getRatings, addRating } from "../api/ratings";

export const useRating = (videoId) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!videoId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getRatings(videoId);
        setRatings(response || []);

        // Calculate average
        if (response && response.length > 0) {
          const total = response.reduce((sum, item) => sum + item.rating, 0);
          setAverageRating(total / response.length);
          setRatingCount(response.length);
        }
      } catch (err) {
        setError("Failed to load ratings");
        console.error("Error fetching ratings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [videoId]);

  const submitRating = async (value) => {
    setLoading(true);
    setError(null);

    try {
      await addRating(videoId, value);
      setUserRating(value);

      // Update local state to reflect the new rating
      const updatedRatings = [...ratings, { rating: value }];
      setRatings(updatedRatings);

      const total = updatedRatings.reduce((sum, item) => sum + item.rating, 0);
      setAverageRating(total / updatedRatings.length);
      setRatingCount(updatedRatings.length);

      return true;
    } catch (err) {
      setError("Failed to submit rating");
      console.error("Error submitting rating:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    averageRating,
    ratingCount,
    userRating,
    loading,
    error,
    submitRating,
  };
};
