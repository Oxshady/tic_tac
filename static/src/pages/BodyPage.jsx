import React, {useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BackgroundMusic from '../component/BackgroundMusic'
import VolumeToggle from '../component/VolumeToggle'

function BodyPage() {
  const [isMuted, setIsMuted] = useState(true);
  const navigate = useNavigate();
  function handleHome() {
    navigate('/');
  }
   const handleVolumeToggle = (mute) => {
     setIsMuted(mute);
   };


  return (
    <section className="glass">
      <div className="home-btn" onClick={handleHome}>
        <i className="fas fa-home"></i> Home
      </div>
      <div>
      <VolumeToggle onToggle={handleVolumeToggle} />
      </div>
      <BackgroundMusic isMuted={isMuted} />
      <div className="games">
        <Outlet /> {/* This will render the content of the child routes */}
      </div>
    </section>
  );
}

export default BodyPage;
