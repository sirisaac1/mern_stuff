const express = require("express");
const app = express();
const cors = require("cors");
const spotifyDataRoute = require('./routes/spotifyDataRoute');
const axios = require("axios");
const querystring = require('querystring');

let client_id = 'ffd656d913a34250893249be0fb51e92';
let redirect_uri = 'http://localhost:3000/';
let client_secret = 'bfde7a72aac746b098582a7f651bcdc4';

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with the actual origin of your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // This enables passing cookies and other credentials with requests
}));

app.use(express.json());//setup middleware to parse json
app.use(require("./routes/record"));//mongodbrecords
app.use(spotifyDataRoute);

// get driver connection for mongodb
const dbo = require("./db/conn");
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });
  console.log(`Server is running on port: ${port} you goddamn degenerate`);
});

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

app.get('/login', function(req, res) {

var state = generateRandomString(16);
var scope = 'user-top-read';

res.redirect('https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
  }));
});

app.get('/callback', async function(req, res) {
const code = req.query.code || null;
const state = req.query.state || null;
let accessToken;

if (state === null) {
  res.redirect('/#' +
    querystring.stringify({
      error: 'state_mismatch'
    }));
} else {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    data: querystring.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
  };

  try {
    // Make the request to get the access token
    const response = await axios(authOptions);
    
    // Assuming you have the access token in the response data
    accessToken = response.data.access_token;

    // Now you can use the accessToken variable as needed

    // ... rest of your logic ...
    res.json({ accessToken });

  } catch (error) {
    console.error('Error getting access token:', error.message);
    res.status(500).send('Internal Server Error');
  }
}

});

async function fetchWebApi(endpoint, method, body, accessToken) {
  try {
    const response = await axios({
      method,
      url: `https://api.spotify.com/${endpoint}`,
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

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=short_term&limit=5', 'GET'
  )).items;
}

app.get('/trigger-top-tracks', async function(req, res) {
  try {
    const topTracks = await getTopTracks();
    res.json(topTracks);
  } catch (error) {
    console.error('Error connecting to Spotify API:', error);
    res.status(500).send('Internal Server Error');
  }
});

