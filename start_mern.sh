#!/bin/bash

# Navigate to the server directory and start the Node.js server
cd /c/Users/Isaac/Desktop/mern_stuff/server
node server.js &

# Wait for the server to start before proceeding (adjust the sleep duration if needed)
sleep 5

# Open a new Git Bash window and navigate to the client directory, then start the React app
start "" /c/Users/Isaac/Desktop/mern_stuff/client
npm start