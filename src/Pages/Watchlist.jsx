import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../CSS/Watchlist.css";

const Watchlist = ({ user }) => {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setWatchlist(userData.watchlist || []);
      } else {
        console.log("No such document!");
      }
    };

    fetchWatchlist();
  }, [user]);

  return (
    <main id="watchlist">
      <h1>Your Watchlist</h1>
      <div className="watchlist-grid">
        {watchlist.length > 0 ? (
          watchlist.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={movie.image}
                alt={movie.title}
                className="movie-image"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
                <button className="watch-button">Watch Now</button>
              </div>
            </div>
          ))
        ) : (
          <p>No movies in your watchlist yet!</p>
        )}
      </div>
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </main>
  );
};

export default Watchlist;
