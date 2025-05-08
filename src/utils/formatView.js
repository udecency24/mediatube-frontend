/**
 * Format view count to a more readable format
 * @param {number} viewCount - The number of views
 * @returns {string} - Formatted view count
 */
export const formatViewCount = (viewCount) => {
  if (viewCount === undefined || viewCount === null) return "0 views";

  if (viewCount === 0) return "No views";
  if (viewCount === 1) return "1 view";

  if (viewCount < 1000) {
    return `${viewCount} views`;
  }

  if (viewCount < 1000000) {
    return `${(viewCount / 1000).toFixed(1).replace(/\.0$/, "")}K views`;
  }

  return `${(viewCount / 1000000).toFixed(1).replace(/\.0$/, "")}M views`;
};
