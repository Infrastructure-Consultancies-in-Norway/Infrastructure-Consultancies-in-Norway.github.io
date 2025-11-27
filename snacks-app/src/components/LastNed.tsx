import React from 'react';

const LastNed: React.FC = () => {
  return (
    <div id="last-ned" className="slide-component container my-5">
      <h2>Last ned</h2>
      <div className="list-group">
        <a href="#" className="list-group-item list-group-item-action">Rapport: Behovsanalyse (PDF)</a>
        <a href="#" className="list-group-item list-group-item-action">Rapport: Sluttrapport (PDF)</a>
        <a href="#" className="list-group-item list-group-item-action">SNACKS egenskaper (excel)</a>
        <a href="#" className="list-group-item list-group-item-action">Eksempelmodell (IFC)</a>
      </div>
    </div>
  );
};

export default LastNed;
