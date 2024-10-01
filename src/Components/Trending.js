import React, { useState, useEffect } from "react";
import "../CSS/Trending.css";
import axios from "axios";

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = "fd8eddd4ba3328dc547b4160854ec3a0";
    const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

    const fetchMovies = async () => {
      try {
        const res = await axios.get(url);
        let movieData = res.data.results.map((movie) => ({
          title: movie.title,
          description: movie.overview,
          image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
          url: `https://www.themoviedb.org/movie/${movie.id}`, // Link to the movie page
        }));

        // Shuffle the movies and select 6 random ones
        movieData = movieData.sort(() => Math.random() - 0.5).slice(0, 10);

        setTrending(movieData);
        setLoading(false); // Stop loading once movies are fetched
      } catch (err) {
        console.error("Error fetching movies:", err);
        setLoading(false); // Even on error, stop loading
      }
    };

    fetchMovies();
  }, []);

  // Function to handle clicking on a movie item
  const handleUrl = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="trending-container">
      <section className="trending-section">
        <h1 className="trending-title">Trending Now</h1>
        <section className="trending-movie-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton-movie-card" />
              ))
            : trending.map((item, index) => (
                <div
                  key={index}
                  className="trendItem"
                  onClick={() => handleUrl(item.url)}
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                  title={item.title}
                >
                  <div className="movie-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.description.slice(0, 60)}...</p>
                  </div>
                </div>
              ))}
        </section>
      </section>
    </div>
  );
};

export default Trending;
