import React from 'react';

const SnacksStrukturen: React.FC = () => {
  return (
    <div id="snacks-strukturen" className="slide-component container my-5">
      <h2>SNACKS - Strukturen</h2>
      
      <div className="mb-5">
        <h3>IFC Spatial Breakdown System</h3>
        <div className="row">
            <div className="col-md-6">
                <img src="/Spatial_Breakdown_System_01.png" alt="Spatial Breakdown System 1" className="img-fluid mb-3" />
            </div>
            <div className="col-md-6">
                <img src="/Bru01.png" alt="Bru 1" className="img-fluid mb-3" />
            </div>
        </div>
      </div>

      <div className="mb-5">
        <h3>Egenskaper på modellnivå</h3>
        <div className="row">
            <div className="col-md-6">
                <img src="/Spatial_Breakdown_System_02.png" alt="Spatial Breakdown System 2" className="img-fluid mb-3" />
            </div>
            <div className="col-md-6">
                <img src="/Bru02.png" alt="Bru 2" className="img-fluid mb-3" />
            </div>
        </div>
      </div>

      <div className="mb-5">
        <h3>Egenskaper på objektnivå</h3>
        <div className="row">
            <div className="col-md-6">
                <img src="/Spatial_Breakdown_System_03.png" alt="Spatial Breakdown System 3" className="img-fluid mb-3" />
            </div>
            <div className="col-md-6">
                <img src="/Bru03.png" alt="Bru 3" className="img-fluid mb-3" />
            </div>
        </div>
        <p>
          I SNACKS strukturen legges egenskaper knyttet til Egenskapssett på objekter på «objektnivå». 
          Det er i SNACKS strukturen kun mulig å knytte egenskaper til objekter på «objektnivå».
          Det er ikke mulig å knytte egenskaper til objekter på «sammensatt objektnivå». 
          Bruk av «aggregerte objekter» tillates med andre ord ikke.
        </p>
      </div>

      <div className="mb-5">
        <h3>Avvik fra Ifc skjemaet</h3>
        <p>SNACKS strukturen avviker fra Ifc skjema på følgende punkter:</p>
        <ol>
            <li>Navn på egenskaper er egendefinerte og avviker fra standard navngivning i Ifc skjemaet.</li>
            <li>SNACKS strukturen tillater ikke objekt egenskaper på «sammensatt objekt nivå» i Ifc skjemaet.</li>
        </ol>
      </div>

      <div className="mb-5">
        <h3>Egenskapssett</h3>
        <p>Egenskapssett inkluderes for alle objekttyper.</p>
        <p>Egenskapssett inkluderes kun for relevante objekttyper.</p>
      </div>
    </div>
  );
};

export default SnacksStrukturen;
