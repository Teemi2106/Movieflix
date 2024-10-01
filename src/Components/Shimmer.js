import React from "react";
import "../CSS/Shimmer.css";

const Shimmer = () => {
  return (
    <div className="shimmer-wrapper">
      <div className="shimmer-movie-card">
        <div className="shimmer-movie-image"></div>
        <div className="shimmer-movie-info">
          <div className="shimmer-title"></div>
          <div className="shimmer-button"></div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
