#!/usr/bin/bash
echo "install requirments of flask"
pip3 install -r req.txt
echo "install requirment of node"
cd static
npm install
cd ..
echo "starting Flask server..."
python3 main.py &
echo "starting React app..."
cd static
npm run dev &
echo "Starting Node.js backend server..."
node server.js &
wait
