import React, { useState } from 'react';
export default function RoomIdForm({ onJoinRoom, connectedPlayers }) {
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (roomId) {
      onJoinRoom(roomId);
    }
  };

  return (
    <div id="room-id-form">
      <h2>Enter Room ID</h2>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
        className="room-id-input"
      />
      <button onClick={handleJoinRoom} className="join-room-button">
        Join Room
      </button>

      {/* Show waiting message if only one player is connected */}
      {connectedPlayers.length === 1 && (
        <p>Waiting for another player to join...</p>
      )}
    </div>
  );
}