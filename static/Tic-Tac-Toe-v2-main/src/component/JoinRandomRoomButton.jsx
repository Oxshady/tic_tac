import React from 'react';

const JoinRandomRoomButton = ({ onJoinRandomRoom }) => {
  return (
    <button onClick={onJoinRandomRoom}>
      Join Random Room
    </button>
  );
};

export default JoinRandomRoomButton;
