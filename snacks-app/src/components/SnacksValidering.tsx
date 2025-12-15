import React from 'react';
import './SnacksValidering.css';

const SnacksValidering: React.FC = () => {
  return (
    <div id="snacks-validering" className="snacks-validering-sticky py-5">
        {/* First box - N400 with light green border */}
        <div className="validation-box-green">
          <p className="validation-box-text">
            SNACKS-strukturen er godkjent for bruk i modellbaserte leveranser i henhold til N400
          </p>
          <img 
            src="/N400_Figur.png" 
            alt="N400 Logo" 
            className="validation-box-logo-n400"
          />
          <a href="#" className="validation-box-link">
            Les mer her
          </a>
        </div>

        {/* Second box - Vegvesen with grey border */}
        <div className="validation-box-grey">
          <img 
            src="/vegvesen-logo-farger-pos-rgb.webp" 
            alt="Statens vegvesen logo" 
            className="validation-box-logo-svv"
          />
          <p className="validation-box-text validation-box-text-color-grey">
            SNACKS-strukturen er utarbeidet i samarbeid med Statens vegvesen Vegdirektoratet
          </p>
        </div>
    </div>
  );
}       

export default SnacksValidering;