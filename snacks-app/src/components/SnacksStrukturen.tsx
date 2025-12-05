import React from 'react';
import './SnacksStrukturen.css';

const useScrollFade = (threshold = 0.5) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
};

const SnacksStrukturen: React.FC = () => {
  const bruSpatialImage = useScrollFade();
  const bruModelImage = useScrollFade();
  const bruObjectImage = useScrollFade();

  return (
    <div id="snacks-strukturen" className="slide-component container my-5 pt-5">
      <div className="mb-5">
        <h3>
          <span className="text-dark-green">IFC Spatial Breakdown System</span>
        </h3>
        <div className="row position-relative my-4">
                <img src="/Spatial_Breakdown_System_01.png" alt="Spatial Breakdown System 1" className="img-fluid mb-3 snacks-image-shadow" />
            <div className="col-md-6 position-relative">
                <div
                  ref={bruSpatialImage.ref}
                  className={`scroll-fade-image ${bruSpatialImage.isVisible ? 'is-visible' : ''}`}
                >
                  <img src="/Bru01.png" alt="Bru 1" className="img-fluid mb-3" />
                </div>
            </div>
            <div className="col-md-6 position-relative">
                <div className="bordered-text-box">
                  <p className="large-text mb-0">
                    IFC Spatial Breakdown System er en funksjonalitet i IFC-formatet som definerer flere nivåer av informasjon, også kalt et informasjonshierarki.
                  </p>
                  <p className="large-text mb-0 mt-3">
                    Egenskaper som plasseres høyt i hierarkiet arves av elementer lenger ned i hierarkiet. Dette gjør at egenskaper som beskriver generell informasjon kan samles på en plass i stedet for å måtte knyttes til hvert enkelt element.
                  </p>
                </div>
            </div>
        </div>
      </div>

      <div className="mb-5 pt-5">
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
                <div
                  ref={bruModelImage.ref}
                  className={`scroll-fade-image ${bruModelImage.isVisible ? 'is-visible' : ''}`}
                >
                  <img src="/Bru02.png" alt="Bru 2" className="img-fluid mb-3" />
                </div>
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

      <div className="mb-5 pt-5">

        {/* Egenskaper på elementnivå */}
        <h3>
          <span className="text-dark-green">Egenskaper på elementnivå</span>
        </h3>
        <div className="row position-relative">
            <div className="col-12 position-relative p-0">
                <img src="/Spatial_Breakdown_System_03.png" alt="Spatial Breakdown System 3" className="img-fluid w-100 mb-3" />
                <div className="image-connector image-connector-object">
                    <div className="connector-line-vertical"></div>
                </div>
            </div>
            <div className="col-md-9 offset-md-3 position-relative">
                <div className="bordered-text-box-connector">
                  <p className="large-text mb-3">
                    Egenskapssett på elementnivå
                  </p>
                  
                  <div className="row">
                    <div className="col-6">
                      {['BIM_Beskrivelse *', 'BIM_FDV *', 'BIM_Tverrfaglig *', 'KON_Felles *'].map(item => (
                        <div key={item} className='bim-objektinfo-badge-1'>
                          <p className='mb-0'>{item}</p>
                        </div>
                      ))}
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <p className="mt-3 small"><em>* Inkluderes for alle elementtyper</em></p>
                      <p className="mt-3 small"><em>** Inkluderes kun for relevante elementtyper</em></p>
                    </div>
                    
                    <div className="col-6">
                      {['KON_Fuger **', 'KON_Geometri **', 'KON_Peler **', 'KON_Stål **', 'KON_Sveis **', 'KON_Festemidler **', 'KON_Tre **', 'KON_Armering **', 'KON_Betong **', 'KON_Spennarmering **', 'KON_Lager **'].map(item => (
                        <div key={item} className='bim-objektinfo-badge-2 w-100'>
                          <p className='mb-0'>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
        </div>

        <div className="row position-relative">

            <div className="col-md-6 position-relative">
                <div
                  ref={bruObjectImage.ref}
                  className={`scroll-fade-image ${bruObjectImage.isVisible ? 'is-visible' : ''}`}
                >
                  <img src="/Bru03.png" alt="Bru 3" className="img-fluid mb-3" />
                </div>
            </div>

            <div className="col-md-6 position-relative">
                <div className="bordered-text-box">
                  <p className="large-text mb-0">
                    I SNACKS strukturen legges egenskaper knyttet til egenskapssett på elementer på «elementnivå». 
                    Det er i SNACKS strukturen kun mulig å knytte egenskaper til elementer på «elementnivå».
                    <br /><br />
                    Det er ikke mulig å knytte egenskaper til elementer på «sammensatt elementnivå». 
                    {/* Bruk av «aggregerte objekter» tillates med andre ord ikke. */}
                  </p>
                </div>
            </div>
        </div>

      <div className="mb-5 pt-5">
        <h3>
          <span className="text-dark-green">Avvik fra Ifc-skjemaet</span>
        </h3>
        <div className="row position-relative my-4">
                <img src="/Spatial_Breakdown_System_01.png" alt="Spatial Breakdown System 1" className="img-fluid mb-3 snacks-image-shadow" />
        <div className="mb-5">
        <p className="large-text">SNACKS-strukturen avviker fra Ifc-skjema på følgende punkter:</p>
        <ol>
            <li>Navn på egenskaper er egendefinerte og avviker fra standard navngivning i Ifc-skjemaet.</li>
            <br />
            <p className="large-text"> ÅRSAK: Tekst</p>
            <li>SNACKS-strukturen tillater ikke elementegenskaper på «sammensatt elementnivå» i Ifc-skjemaet.</li>
            <br />
            <p className="large-text"> ÅRSAK: Tekst</p>
        </ol>
      </div>

        </div>
      </div>

      </div>
    </div>
  );
};

export default SnacksStrukturen;
