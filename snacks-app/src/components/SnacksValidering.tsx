import React from 'react';


const SnacksValidering: React.FC = () => {
  return (
    <div id="snacks-validering" className="snacks-validering-sticky my-5 p-3 border rounded bg-light-green">
        <h3>Validering av SNACKS</h3>
        <p className="large-text">
            For å sikre at IFC-modeller følger SNACKS-standarden, er det utviklet et valideringsverktøy som kan brukes til å kontrollere modeller mot SNACKS-kravene. Verktøyet sjekker blant annet at egenskaper er korrekt navngitt, plassert i riktige egenskapssett, og at verdier følger de tillatte formatene.
        </p>
</div>
  );
}       

export default SnacksValidering;