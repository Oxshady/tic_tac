import React from 'react';

function JoinMethodSelection({ onSelectJoinMethod, onJoinRandomRoom }) {
  return (
    <div className="join-method-selection">
      <h2>Select a Method to Join a Room</h2>
      <button onClick={() => onSelectJoinMethod('roomId')}>Join by Room ID</button>
      <button onClick={onJoinRandomRoom}>Join Random Room</button>
    </div>
  );
}

export default JoinMethodSelection;
