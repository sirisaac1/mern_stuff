import React, { useState, useEffect } from 'react';

const SpotifyData = () => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    // Fetch data from the server (you might use the Fetch API, Axios, or any other library)
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/spotifyData/callback'); // Replace with your actual API endpoint
  
        if (!response.ok) {
          // Check if the response status is not OK
          console.error(`Error fetching data. Status: ${response.status}, ${response.statusText}`);
          return;
        }
  
        const data = await response.json();
        setTopTracks(data); // Assuming the response contains an array of top tracks
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once on mount

  if (!topTracks || topTracks.length === 0) {
    return (
      <div>
        <h1>No Top Tracks Available</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Top Spotify Tracks</h1>
      <ul>
        {topTracks.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifyData;