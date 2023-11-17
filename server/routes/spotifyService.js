const axios = require('axios'); // to make spotify API endpoint requests
const querystring = require("querystring");
const clientId = 'ffd656d913a34250893249be0fb51e92';
const clientSecret = 'bfde7a72aac746b098582a7f651bcdc4';
const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
const redirectUri = 'http://localhost:3000/spotifyData';
const scope = 'user-top-read';
const express = require('express');

//for auth process
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let index = 0; index < length; index++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
  
    return randomString;
  };

// Define the authorizeSpotify function to send the user to the Spotify authorization page
const authorizeSpotify = (clientId, redirectUri, scope) => {
    const authApp = express();
  //when user accesses /login redirect to spotify auth with specified parameters
    authApp.get('/login', (req, res) => {
      const state = generateRandomString(16);
  
      res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: clientId,
          scope: scope,
          redirect_uri: redirectUri,
          state: state
        }));
    });
  
    return authApp;
  };

const spotifyApp = authorizeSpotify(clientId, redirectUri, scope);

// should return auth code
const getSpotifyAccessToken = async (code, redirectUri) => {
    try {
      const response = await axios.post(
        spotifyTokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          },
          timeout: 10000,
        }
      );
  
      return response.data.access_token;
    } catch (error) {
      console.error('Error obtaining Spotify access token:', error.message);
      throw error; // Rethrow the error to be handled by the calling function
    }
  };
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/';
async function fetchWebApi(endpoint, method = 'GET', body, accessToken) {
  try {
    const response = await axios({
      method,
      url: `${SPOTIFY_API_BASE_URL}/${endpoint}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body),
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function getTopTracks() {
    try {
      const topTracks = await fetchWebApi(
        'me/top/tracks?time_range=short_term&limit=5'
      );
  
      return topTracks.items;
    } catch (error) {
      console.error('Error getting top tracks:', error.message);
      throw error;
    }
  }

const getAccessToken = async (code) => {
    try {
      const accessToken = await getSpotifyAccessToken(code, redirectUri);
      console.log('Access Token:', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Internal Server Error, error obtaining access token', error.message);
      throw error;
    }
  };

const getTopTracksHandler = async (req, res) => {
  try {
    const accessToken = await getAccessToken(req.query.code);
    const topTracks = await getTopTracks(accessToken);
    res.json(topTracks);
  } catch (error) {
    console.error('Error connecting to Spotify API:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { getTopTracks, authorizeSpotify, getSpotifyAccessToken, getTopTracksHandler, getAccessToken, spotifyApp };