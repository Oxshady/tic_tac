import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';


function BodyPage() {
  const navigate = useNavigate();
  function handleHome() {
    navigate('/');
  }
  return (
    <section className="glass">
        <div className="home-btn" onClick={handleHome}>
              <i className="fas fa-home"></i> Home
        </div>
      <div className="games">
        <Outlet /> {/* This will render the content of the child routes */}
      </div>
    </section>
  );
}

export default BodyPage;
