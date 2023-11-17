import React, { useState, useEffect } from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 // We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import SpotifyData from "./components/spotifyData";//spotify API data page
import TopTracks from "./components/topTracks";
import axios from 'axios';
const App = () => {
//add <Route path="/spotifyData" element={<SpotifyData topTracks={topTracks} />} />
 return (
   <div>
     <Navbar />
     <Routes>
       <Route exact path="/" element={<RecordList />} />
       <Route path="/edit/:id" element={<Edit />} />
       <Route path="/create" element={<Create />} />
       <Route path="/spotifyData/login" element={<SpotifyData />} />
       <Route path="/trigger-top-tracks" element={<TopTracks />} />
     </Routes>
   </div>
 );
};
 export default App;