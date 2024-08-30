import React, { useState } from 'react';
import RoomIdForm from './RoomIDForm';

const RoomSelection = ({ onJoinRoom }) => {
  const [showRoomIdForm, setShowRoomIdForm] = useState(false);

  const handleJoinClick = () => {
    setShowRoomIdForm(true);
  };

  return (
    <div>
      {!showRoomIdForm && (
        <button onClick={handleJoinClick}>
          Join by a Room ID
        </button>
      )}
      {showRoomIdForm && <RoomIdForm onJoinRoom={onJoinRoom} />}
    </div>
  );
};

export default RoomSelection;
