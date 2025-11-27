import React from 'react';

const SnacksMain: React.FC = () => {
  return (
    <div id="snacks-main" className="slide-component container my-5">
      <h1>SNACKS</h1>
      <h2>Formål</h2>
      <p className="lead">Standardisering, Del 1: SNACKS - Strukturen</p>
      <p>
        SNACKS er et samarbeid mellom Sweco, Norconsult, Aas-Jakobsen og Cowi med mål å standardisere IFC-modeller av bruer og andre samferdselskonstruksjoner.
      </p>
      <div className="text-center my-4">
        <img src="/Personer01.png" alt="Personer" className="img-fluid" />
      </div>
      <p>
        Formålet med SNACKS-strukturen er å effektivisere modellproduksjon, redusere usikkerhet i kontrollprosesser og å forenkle bruk av IFC-modeller i bygging og forvaltning av konstruksjoner innen samferdsel.
      </p>
      <p>
        Konsistent bruk av SNACKS-strukturen vil også gjøre det enklere for bransjen å utvikle og drifte gjenbrukbare systemer og arbeidsmetodikk.
      </p>
    </div>
  );
};

export default SnacksMain;
