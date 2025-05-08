import React from "react";

const Loader = ({ size = "medium", color = "blue", fullScreen = false }) => {
  // Size classes
  const sizeClasses = {
    small: "h-5 w-5 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-3",
    xlarge: "h-16 w-16 border-4",
  };

  // Color classes
  const colorClasses = {
    blue: "border-blue-600",
    red: "border-red-600",
    green: "border-green-600",
    yellow: "border-yellow-600",
    gray: "border-gray-600",
    white: "border-white",
  };

  const spinnerClasses = `
    animate-spin 
    rounded-full 
    ${sizeClasses[size]} 
    border-t-transparent 
    ${colorClasses[color]}
  `;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className={spinnerClasses}></div>
      </div>
    );
  }

  return <div className={spinnerClasses}></div>;
};

export default Loader;
