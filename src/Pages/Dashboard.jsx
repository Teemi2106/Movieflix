import React, { useState, useEffect, Suspense, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth, firestore } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import axios from "axios";
import "../CSS/Dashboard.css";
import Shimmer from "../Components/Shimmer";
import MovieModal from "../Components/MovieModal";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  /*   const firstName = user ? user.name.split(" ")[0] : ""; */

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const fetchWatchlist = useCallback(async () => {
    const userRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setWatchlist(userDoc.data().watchlist || []);
    } else {
      console.log("No such document!");
    }
  }, [user.uid]);

  const addToWatchlist = async (movie) => {
    const userRef = doc(firestore, "users", user.uid);
    try {
      await updateDoc(userRef, {
        watchlist: arrayUnion(movie),
      });
      setWatchlist((prev) => [...prev, movie]);
      console.log(`${movie.title} added to watchlist`);
    } catch (err) {
      console.error("Error adding movie to watchlist:", err);
    }
  };

  const removeFromWatchlist = async (movie) => {
    const userRef = doc(firestore, "users", user.uid);
    try {
      await updateDoc(userRef, {
        watchlist: arrayRemove(movie),
      });
      setWatchlist((prev) => prev.filter((item) => item.id !== movie.id));
      console.log(`${movie.title} removed from watchlist`);
    } catch (err) {
      console.error("Error removing movie from watchlist:", err);
    }
  };

  const isInWatchlist = (movie) => {
    return watchlist.some((item) => item.id === movie.id);
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const fetchMovies = async (query) => {
    const apiKey = "fd8eddd4ba3328dc547b4160854ec3a0";
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

    if (query) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    }

    try {
      const res = await axios.get(url);
      let movieData = res.data.results
        .filter((movie) => movie.poster_path)
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          description: movie.overview,
          image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
          rating: movie.vote_average,
          release_date: movie.release_date,
        }));

      setItems(movieData);
      setLoading(false); // Set loading to false after fetching data
    } catch (err) {
      console.error("Error fetching movies:", err);
      setLoading(false); // Stop loading even if there is an error
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchMovies(searchQuery); // Fetch movies based on search query
  };

  return (
    <div id="canvas">
      <main id="dashboard">
        <header id="dashboardHeader">
          <h1
            style={{ fontSize: "3.5vmin", cursor: "pointer", color: "white" }}
            onClick={() => window.location.reload()}
          >
            Welcome, {user.name}!
          </h1>

          <form onSubmit={handleSearchSubmit} id="searchForm">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for movies..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          <button id="logout" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <section id="misc">
          {/*           <h2 style={{ color: "white" }}>Your Dashboard</h2> */}
          <p style={{ color: "white", marginBottom: "1vmin" }}>
            Here you can manage your account, watch movies, and more.
          </p>

          <div>
            <button className="hb" onClick={() => navigate("/profile")}>
              View Profile
            </button>
            <button className="hb" onClick={() => navigate("/watchlist")}>
              View Watchlist
            </button>
          </div>
        </section>
        <section id="moviesSection">
          <h2>Popular Movies</h2>
          <div className="movie-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Shimmer key={index} />
                ))
              : items.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => openModal(movie)} // Open modal on movie click
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="movie-image"
                    />
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      <div id="btDiv">
                        <button className="hb">Watch</button>
                        {isInWatchlist(movie) ? (
                          <button
                            className="hb"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromWatchlist(movie);
                            }}
                          >
                            Remove from Watchlist
                          </button>
                        ) : (
                          <button
                            className="hb"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToWatchlist(movie);
                            }}
                          >
                            Add to Watchlist
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>
        <Suspense>
          {selectedMovie && (
            <MovieModal movie={selectedMovie} onClose={closeModal} />
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default Dashboard;
