import React from "react";
import "../CSS/MovieModal.css";

const MovieModal = ({ movie, onClose }) => {
  // Helper function to generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2); // full stars count
    const halfStar = rating % 2 >= 1 ? 1 : 0; // whether to show half-star

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star full-star">
          &#9733;
        </span>
      );
    }
    if (halfStar) {
      stars.push(
        <span key="half" className="star half-star">
          &#9734;
        </span>
      );
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty-star">
          &#9734;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-info">
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          <p>Release Date: {movie.release_date}</p>
          <div className="movie-rating">
            <p>Rating: {renderStars(movie.rating)}</p>
          </div>
          <a
            href={`https://www.youtube.com/results?search_query=${movie.title} trailer`}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-watch-button"
          >
            Watch Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
