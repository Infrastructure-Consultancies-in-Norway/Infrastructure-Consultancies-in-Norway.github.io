import React from 'react';
import './Tilleggsinformasjon.css';

const Tillegsinformasjon: React.FC = () => {
  return (
    <div id="tilleggsinformasjon" className="slide-component container mt-5">
      <h2>Tilleggsinformasjon</h2>
      <div className="tilleggsinformasjon-video mt-5">
        <div className="tilleggsinformasjon-video-header">
          <h3>Presentasjon BA-Nettverket</h3>
        </div>
        <div className="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/PLPpRe9ESuQ" title="BA-Nettverket Presentasjon" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
};

export default Tillegsinformasjon;