import React from 'react';

const StandardiseringDel1: React.FC = () => {
  return (
    <div id="standardisering-del-1" className="slide-component container my-5 pt-5">
      <h2>
        <span className="text-light-green">Standardisering, Del 1:</span><br />
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
      </ul>
      <div className="text-center my-4">
        <img src="/Spatial_Breakdown_System_04.png" alt="Spatial Breakdown System" className="img-fluid" />
      </div>
    </div>
  );
};

export default StandardiseringDel1;
