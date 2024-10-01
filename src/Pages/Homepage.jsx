import React from "react";
import Carousel from "../Components/Carousel";
import "../CSS/homepage.css";
import Trending from "../Components/Trending";

const Homepage = ({ handleSignin }) => {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <header id="hero">
        <h1>MovieFlix</h1>
        <button id="signIn" onClick={handleSignin}>
          Sign In
        </button>
      </header>

      <section id="homeMain">
        <div>
          <h1>Movies, Series, TV Shows and More...</h1>
          <p>Buckle up, Grab your Popcorn and Let's Binge off</p>
          <button onClick={handleSignin}>Get Started</button>
        </div>
      </section>
      <Carousel />
      <Trending />
    </div>
  );
};

export default Homepage;
