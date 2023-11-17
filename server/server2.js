var client_id = 'ffd656d913a34250893249be0fb51e92';
var redirect_uri = 'http://localhost:3000/';
var client_secret = 'bfde7a72aac746b098582a7f651bcdc4';

var app = express();



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

const axios = require('axios');

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

const topTracks = await getTopTracks();
  console.log(
    topTracks?.map(
      ({name, artists}) =>
        `${name} by ${artists.map(artist => artist.name).join(', ')}`
    )
  );