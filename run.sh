#!/usr/bin/bash
echo "Starting Flask server..."
python3 main.py &
echo "Starting React app..."
cd static
npm run dev &
echo "Starting Node.js backend server..."
node server.js &
wait
