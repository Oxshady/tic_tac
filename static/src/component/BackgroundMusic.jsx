// BackgroundMusic.js
import React, { useRef, useEffect } from "react";
import backgroundMusic from "../assets/background.wav"; // Adjust path as needed

const BackgroundMusic = ({ isMuted }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.play();
    if(!isMuted){
        audio.play();
    }
    audio.volume = isMuted ? 0 : 0.5;

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset playback position when component unmounts
    };
  }, [isMuted]);

  return (
    <audio ref={audioRef} loop>
      <source src={backgroundMusic} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default BackgroundMusic;
