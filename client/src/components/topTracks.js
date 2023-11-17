import React, { useEffect, useState } from 'react';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your Express server
        const response = await fetch('http://localhost:3000/trigger-top-tracks');
        const data = await response.json();

        
        console.log(response);
        setTopTracks(data); // Assuming the response contains an array of top tracks
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      <h2>Top Tracks</h2>
      <ul>
        {topTracks.map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;