import React from 'react';

const Begrepsforklaring: React.FC = () => {
  return (
    <div id="begrepsforklaring" className="slide-component container my-5">
      <h2>Begrepsforklaring</h2>
      
      <div className="row mb-5">
        <div className="col-md-6">
          <ul>
            <li>Attributt</li>
            <li>IFC-skjema</li>
            <li>BIM tittelfelt</li>
            <li>IFC Spatial breakdown system</li>
            <li>BSDD (BuildingSMART Data Dictionary)</li>
            <li>IFC-entitet</li>
            <li>Datastruktur</li>
            <li>Informasjonsobjekt</li>
            <li>IDS (Information Delivery Specification)</li>
          </ul>
        </div>
        <div className="col-md-6">
          <ul>
            <li>Egenskap (Engelsk: Property)</li>
            <li>IFC (Industry Foundation Classes)</li>
            <li>Egenskapssett (Engelsk: Pset / PropertySet)</li>
            <li>IFC Bridge</li>
            <li>Modell</li>
            <li>IFC2x3</li>
            <li>Objekt</li>
            <li>IFC4.3</li>
            <li>Objektinformasjon</li>
          </ul>
        </div>
      </div>

      <div className="mb-5">
        <h3>Egenskap vs Attributt</h3>
        <p className="large-text">
          I IFC-sammenheng brukes begrepene «egenskap» (engelsk: property) og «attributt» (engelsk: attribute) ofte om hverandre. 
          Både egenskaper og attributter knyttes til en IFC-entitet og gir spesifikk informasjon om entiteten. 
          Attributter er dog forhåndsdefinert i IFC-standarden, mens egenskaper opprettes av den som produserer modellen.
        </p>
        <p className="large-text">
          Et eksempel på et attributt er 'IfcElement.Length'. Dette attributtet kan brukes for å angi lengden til et objekt, for eksempel en del av en bru. 
          Et eksempel på en egenskap er «MMI». Denne egenskapen sier noe om modenheten til et objekt.
        </p>
      </div>

      <div className="text-center">
        <img src="/Egenskapssett01.png" alt="Egenskapssett" className="img-fluid" />
      </div>
    </div>
  );
};

export default Begrepsforklaring;
