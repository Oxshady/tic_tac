// VolumeToggle.js
import React, { useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Make sure to install react-icons
import "./VolumeToggle.css"
const VolumeToggle = ({ onToggle }) => {
  const [isMuted, setIsMuted] = useState(true);

  const handleClick = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    onToggle(newMuteState);
  };

  return (
    <button onClick={handleClick} className="volume-toggle">
      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
    </button>
  );
};

export default VolumeToggle;
