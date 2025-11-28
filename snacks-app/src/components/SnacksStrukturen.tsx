import React from 'react';
import './SnacksStrukturen.css';

const SnacksStrukturen: React.FC = () => {
  return (
    <div id="snacks-strukturen" className="slide-component container my-5">
      <h2>SNACKS - Strukturen</h2>
      
      <div className="mb-5">
        <h3>
          <span className="text-dark-green">IFC Spatial Breakdown System</span>
        </h3>
        <div className="row position-relative">
                <img src="/Spatial_Breakdown_System_01.png" alt="Spatial Breakdown System 1" className="img-fluid mb-3" />
            <div className="col-md-6 position-relative">
                <img src="/Bru01.png" alt="Bru 1" className="img-fluid mb-3" />
            </div>
            <div className="col-md-6 position-relative">
                <div className="bordered-text-box">
                  <p className="large-text mb-0">
                    IFC Spatial Breakdown System er en funksjonalitet i IFC-formatet som definerer flere nivåer av informasjon, også kalt et informasjonshierarki.
                  </p>
                  <p className="large-text mb-0 mt-3">
                    Egenskaper som plasseres høyt i hierarkiet arves av objekter lenger ned i hierarkiet. Dette gjør at egenskaper som beskriver generell informasjon kan samles på en plass i stedet for å måtte knyttes til hvert enkelt objekt.
                  </p>
                </div>
            </div>
        </div>
      </div>

      <div className="mb-5">
{/* Egenskaper på modellnivå */}
        <h3>
          <span className="text-dark-green">Egenskaper på modellnivå</span>
        </h3>
        <div className="row position-relative">
            <div className="col-12 position-relative p-0">
                <img src="/Spatial_Breakdown_System_02.png" alt="Spatial Breakdown System 2" className="img-fluid w-100 mb-3" />
                <div className="image-connector">
                    <div className="connector-line-vertical"></div>
                    <div className="connector-line-horizontal"></div>
                </div>
            </div>
            <div className="col-md-6 offset-md-6 position-relative">
                <div className="bordered-text-box-connector">
                  <p className="large-text mb-0">
                    Egenskapssett på modellnivå
                  </p>
                  <div className='bim-modellinfo-badge'>
                  <p className="mb-0">BIM_Modellinfo *</p>
                  </div>
                  <p><em>* Egenskapssett skal alltid inkluderes</em></p>
                </div>
            </div>
        </div>


        <div className="row position-relative">

            <div className="col-md-6 position-relative">
                <img src="/Bru02.png" alt="Bru 2" className="img-fluid mb-3" />
            </div>

            <div className="col-md-6 position-relative">
                <div className="bordered-text-box">
                  <p className="large-text mb-0">
                    I SNACKS-strukturen er overordnede egenskaper plassert på «konstruksjonsnivå» og samlet i egenskapssettet «BIM_Modellinfo».
                    <br />
                    <br />
                    Koordinatsystem er et eksempel på en egenskap som knyttes til modellen på «konstruksjonsnivå».
                  </p>
                </div>
            </div>
        </div>
        

      </div>

      <div className="mb-5">

        {/* Egenskaper på objektnivå */}
        <h3>
          <span className="text-dark-green">Egenskaper på objektnivå</span>
        </h3>
        <div className="row position-relative">
            <div className="col-12 position-relative p-0">
                <img src="/Spatial_Breakdown_System_03.png" alt="Spatial Breakdown System 3" className="img-fluid w-100 mb-3" />
                <div className="image-connector">
                    <div className="connector-line-vertical"></div>
                    <div className="connector-line-horizontal"></div>
                </div>
            </div>
            <div className="col-md-6 offset-md-6 position-relative">
                <div className="bordered-text-box-connector">
                  <p className="large-text mb-0">
                    Egenskapssett på objektvinivå
                  </p>
                  <div className='bim-modellinfo-badge'>
                      <p className='mb-0'>BIM_Beskrivelse</p>
                  </div>
                  <div className='bim-modellinfo-badge'>

                      <p className='mb-0'>BIM_Beskrivelse</p>
                  </div>
                  <div className='bim-modellinfo-badge'>
                      
                      <p className='mb-0'>KON_Geometri</p>
                      <p className='mb-0'>KON_Stål</p>
                  </div>
                  <p><em>* Egenskapssett skal alltid inkluderes</em></p>
                </div>
            </div>
        </div>

        <div className="row position-relative">

            <div className="col-md-6 position-relative">
                <img src="/Bru03.png" alt="Bru 3" className="img-fluid mb-3" />
            </div>

            <div className="col-md-6 position-relative">
                <div className="bordered-text-box">
                  <p className="large-text mb-0">
                    I SNACKS strukturen legges egenskaper knyttet til Egenskapssett på objekter på «objektnivå». 
                    Det er i SNACKS strukturen kun mulig å knytte egenskaper til objekter på «objektnivå».
                    <br /><br />
                    Det er ikke mulig å knytte egenskaper til objekter på «sammensatt objektnivå». 
                    {/* Bruk av «aggregerte objekter» tillates med andre ord ikke. */}
                  </p>
                </div>
            </div>
        </div>

        
        <div className="row mt-4">
          <div className="col-md-6">
            <h5>Inkluderes for alle objekttyper (*)</h5>
            <ul>
              <li>BIM_Beskrivelse</li>
              <li>BIM_FDV</li>
              <li>BIM_Tverrfaglig</li>
              <li>KON_Felles</li>
              <li>KON_Fuger</li>
              <li>KON_Geometri</li>
              <li>KON_Peler</li>
              <li>KON_Stål</li>
              <li>KON_Sveis</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h5>Inkluderes kun for relevante objekttyper (**)</h5>
            <ul>
              <li>KON_Festemidler</li>
              <li>KON_Tre</li>
              <li>KON_Armering</li>
              <li>KON_Betong</li>
              <li>KON_Spennarmering</li>
              <li>KON_Lager</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h3>Avvik fra Ifc skjemaet</h3>
        <p className="large-text">SNACKS-strukturen avviker fra Ifc-skjema på følgende punkter:</p>
        <ol>
            <li>Navn på egenskaper er egendefinerte og avviker fra standard navngivning i Ifc-skjemaet.</li>
            <li>SNACKS-strukturen tillater ikke objekt-egenskaper på «sammensatt objekt-nivå» i Ifc-skjemaet.</li>
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
