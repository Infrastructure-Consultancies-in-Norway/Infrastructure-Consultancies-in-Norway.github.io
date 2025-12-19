import React from 'react';

type SnacksMainProps = {
  scrollToSection: (id: string, behavior?: ScrollBehavior) => void;
};

const SnacksMain: React.FC<SnacksMainProps> = ({ scrollToSection }) => {
  return (
    <div id="snacks-main" className="slide-component container my-5">
      <h1>SNACKS</h1>
      <p className="large-text">
        SNACKS er et samarbeid mellom Sweco, Norconsult, Aas-Jakobsen og Cowi med mål å standardisere IFC-modeller av bruer og andre samferdselskonstruksjoner.
      </p>
      <div className="row align-items-center my-4">
        <div className="col-md-6 text-center mb-3 mb-md-0">
          <img src="/Personer01.png" alt="Personer" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <p className="lead">
            <span className="text-light-green fw-bold" onClick={() => scrollToSection('standardisering-del-1')} style={{ cursor: 'pointer' }}>Standardisering del 1:</span><br />
            <span className="text-dark-green fw-bold">SNACKS-strukturen</span>
          </p>
          <p className="lead">
            <span className="text-light-green fw-bold" onClick={() => scrollToSection('standardisering-del-2')} style={{ cursor: 'pointer' }}>Standardisering del 2:</span><br />
            <span className="text-dark-green fw-bold">Standardisert Elementnavn</span><br />
            <span className="text-dark-green">Standardisert Materialliste</span>
          </p>

        </div>
      </div>




    </div>
  );
};

export default SnacksMain;