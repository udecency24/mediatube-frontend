import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingStars = ({ value = 0, onChange, disabled = false, total = 5 }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex">
      {[...Array(total)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label
            key={index}
            className={`cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => !disabled && onChange(ratingValue)}
              className="hidden"
              disabled={disabled}
            />
            <FaStar
              className="transition-colors"
              color={(hover || value) >= ratingValue ? "#ffc107" : "#e4e5e9"}
              size={20}
              onMouseEnter={() => !disabled && setHover(ratingValue)}
              onMouseLeave={() => !disabled && setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default RatingStars;
