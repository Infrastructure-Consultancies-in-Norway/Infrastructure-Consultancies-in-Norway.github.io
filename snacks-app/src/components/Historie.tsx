import React from 'react';
import './Historie.css';

const Historie: React.FC = () => {
  return (
    <div id="historie" className="slide-component container my-5 historie-section">
      <h2>Historie</h2>
      <div className="historie-visual">
        <img src="/Historie01.png" alt="Historie" className="img-fluid" />
        <div className="historie-overlay">
          <p className="large-text mb-0">Vegdirektoratet åpner opp for modellbaserte leveranser.</p>
        </div>
      </div>
    </div>
  );
};

export default Historie;
