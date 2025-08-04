import React from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../Config";

const Home = () => {
  return (
    <div>
      <h1>Welcome to FBGM Sports!</h1>
      <p>Your ultimate destination for NFL Survivor Pools.</p>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/register"><button>Register</button></Link>
    </div>
  );
};

export default Home;