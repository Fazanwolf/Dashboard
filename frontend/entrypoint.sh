#!/bin/bash

# Set the port
PORT=8081

# switch directories
cd build/web/

# Start the server
echo 'Server starting on port' $PORT '...'
http-server -p $PORT --cors