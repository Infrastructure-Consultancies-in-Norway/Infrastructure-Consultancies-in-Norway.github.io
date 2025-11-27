import React from 'react';

const StandardiseringDel1: React.FC = () => {
  return (
    <div id="standardisering-del-1" className="slide-component container my-5">
      <h2>Standardisering, Del 1:</h2>
      <p className="lead">SNACKS - Strukturen</p>
      <p>
        SNACKS-strukturen beskriver hvordan informasjon i IFC-modeller av bruer og andre samferdselskonstruksjoner skal struktureres. De viktigste definisjonene er:
      </p>
      <ul>
        <li>Navn på egenskaper og egenskapssett</li>
        <li>Oppdeling av egenskaper i egenskapssett</li>
        <li>Tillate egenskapsverdier der dette er relevant</li>
        <li>Hvor i IFC Spatial Breakdown System egenskaper plasseres</li>
      </ul>
      <div className="text-center my-4">
        <img src="/Spatial_Breakdown_System_04.png" alt="Spatial Breakdown System" className="img-fluid" />
      </div>
    </div>
  );
};

export default StandardiseringDel1;
