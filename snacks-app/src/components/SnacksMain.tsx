import React from 'react';

const SnacksMain: React.FC = () => {
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
            <span className="text-light-green fw-bold">Standardisering, Del 1:</span><br />
            <span className="text-dark-green fw-bold">SNACKS-strukturen</span>
          </p>
          <p className="lead">
            <span className="text-light-green fw-bold">Standardisering, Del 2:</span><br />
            <span className="text-dark-green fw-bold">Elementnavn</span>
          </p>
        </div>
      </div>


      <h2 className="mt-5">Formål</h2>
      <p className="large-text">
        Formålet med SNACKS-strukturen er å effektivisere modellproduksjon, redusere usikkerhet i kontrollprosesser og å forenkle bruk av IFC-modeller i bygging og forvaltning av konstruksjoner innen samferdsel.
        Konsistent bruk av SNACKS-strukturen vil også gjøre det enklere for bransjen å utvikle og drifte gjenbrukbare systemer og arbeidsmetodikk.
      </p>

    </div>
  );
};

export default SnacksMain;
