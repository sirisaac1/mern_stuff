import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <NavLink to="/">
        <img style={{ "width": "10%" }} src="https://pbs.twimg.com/ext_tw_video_thumb/1235208610696900617/pu/img/pWNiDSyFGu_bo_O2.jpg" alt="logo"></img>  
      </NavLink>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="true"
          aria-label="Toggle navigation"
          style={{ fontSize: "1.5rem", padding: "0.5rem" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse show" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/create">
                Create Record
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/spotifyData/login">
                Spotify Data
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/trigger-top-tracks">
                Trigger Top Tracks
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}