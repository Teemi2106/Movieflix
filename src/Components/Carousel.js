import React, { useState, useEffect } from "react";
import "../CSS/Carousel.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const Carousel = () => {
  const [items, setItems] = useState([]);

  // Function to move to the next item
  const handleNext = () => {
    setItems((prevItems) => [...prevItems.slice(1), prevItems[0]]);
  };

  // Function to move to the previous item
  const handlePrev = () => {
    setItems((prevItems) => [
      prevItems[prevItems.length - 1],
      ...prevItems.slice(0, prevItems.length - 1),
    ]);
  };

  // Automatically change the carousel every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(handleNext, 10000); // Auto-slide every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const apiKey = "fd8eddd4ba3328dc547b4160854ec3a0";
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

    const fetchMovies = async () => {
      try {
        const res = await axios.get(url);
        let movieData = res.data.results
          .filter((movie) => movie.poster_path) // Filter out movies without images
          .map((movie) => ({
            id: movie.id, // Add movie ID
            title: movie.title,
            description: movie.overview,
            image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
          }));

        movieData = movieData.sort(() => Math.random() - 0.5).slice(0, 6);

        setItems(movieData);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <main className="body">
      <ul className="slider" style={{ overflowX: "hidden" }}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`item ${index === 1 ? "active" : ""}`}
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onClick={() =>
              window.open(
                `https://www.themoviedb.org/movie/${item.id}`,
                "_blank"
              )
            } // Opens the movie page in a new tab
          >
            {index === 1 && (
              <div className="content">
                <h2 style={{ color: "white" }} className="title">
                  {item.title}
                </h2>
                <p style={{ color: "white" }} className="description">
                  {item.description}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the parent `li` click event
                    window.open(
                      `https://www.themoviedb.org/movie/${item.id}`,
                      "_blank"
                    );
                  }}
                >
                  Read More
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <nav className="nav">
        <FaArrowLeft className="btn prev" onClick={handlePrev} />
        <FaArrowRight className="btn next" onClick={handleNext} />
      </nav>
    </main>
  );
};

export default Carousel;
