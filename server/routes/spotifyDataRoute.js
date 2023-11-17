const express = require('express');
const axios = require('axios');
const { getTopTracks, authorizeSpotify, getSpotifyAccessToken, getTopTracksHandler, getAccessToken, spotifyApp } = require('./spotifyService');

const spotifyRoute = express.Router();

spotifyRoute.use('/spotifyData/login', authorizeSpotify('ffd656d913a34250893249be0fb51e92', 'http://localhost:3000/callback', 'user-top-read'));



spotifyRoute.get('/callback', getTopTracksHandler);

module.exports = spotifyRoute;