import React from 'react';

const StandardiseringDel1: React.FC = () => {
  return (
    <div id="standardisering-del-1" className="slide-component container my-5 pt-5">
      <h2>
        <span className="text-light-green">Standardisering del 1:</span><br />
      </h2>
      <h3>
        <span className="text-dark-green">SNACKS-strukturen</span>
      </h3>
      <p className="large-text">
        SNACKS-strukturen beskriver hvordan informasjon i IFC-modeller av bruer og andre samferdselskonstruksjoner skal struktureres. De viktigste definisjonene er:
      </p>
      <ul className='large-text'>
        <li>Navn på egenskaper og egenskapssett</li>
        <li>Oppdeling av egenskaper i egenskapssett</li>
        <li>Tillatte egenskapsverdier der dette er relevant</li>
        <li>Hvor i IFC Spatial Breakdown System egenskaper plasseres</li>
        <li>SNACKS kan brukes for både Ifc2x3 og Ifc4.3</li>
      </ul>
      <div className="text-center my-4">
        <img src="/Spatial_Breakdown_System_04.png" alt="Spatial Breakdown System" className="img-fluid" />
      </div>

      <h2 className="mt-5">Formål</h2>
      <p className="large-text">
        Formålet med SNACKS-strukturen er å effektivisere modellproduksjon, redusere usikkerhet i kontrollprosesser og å forenkle bruk av IFC-modeller i bygging og forvaltning av konstruksjoner innen samferdsel.
        Konsistent bruk av SNACKS-strukturen vil også gjøre det enklere for bransjen å utvikle og drifte gjenbrukbare systemer og arbeidsmetodikk.
      </p>
    </div>
  );
};

export default StandardiseringDel1;
