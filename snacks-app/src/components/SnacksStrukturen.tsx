import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
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
  const { t, getImagePath } = useLanguage();
  const bruSpatialImage = useScrollFade();
  const bruModelImage = useScrollFade();
  const bruObjectImage = useScrollFade();

  return (
    <div id="snacks-strukturen" className="slide-component container my-5 pt-5">
      <div className="mb-5">
        <h3>
          <span className="text-dark-green">{t('std1.spatial.title')}</span>
        </h3>
        <div className="row position-relative my-4">
                <img src={getImagePath('/Spatial_Breakdown_System_01.png')} alt="Spatial Breakdown System 1" className="img-fluid mb-3 snacks-image-shadow" />
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
                    {t('std1.spatial.text1')}
                  </p>
                  <p className="large-text mb-0 mt-3">
                    {t('std1.spatial.text2')}
                  </p>
                </div>
            </div>
        </div>
      </div>

      <div className="mb-5 pt-5">
{/* Egenskaper på modellnivå */}
        <h3>
          <span className="text-dark-green">{t('std1.facility.title')}</span>
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
                    {t('std1.facility.subtitle')}
                  </p>
                  <div className='bim-modellinfo-badge'>
                  <p className="mb-0">{t('std1.facility.modelinfo')}</p>
                  </div>
                  <p><em>{t('std1.facility.note')}</em></p>
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
                    {t('std1.facility.text')}
                    <br />
                    <br />
                    {t('std1.facility.example')}
                  </p>
                </div>
            </div>
        </div>
        

      </div>

      <div className="mb-5 pt-5">

        {/* Egenskaper på elementnivå */}
        <h3>
          <span className="text-dark-green">{t('std1.element.title')}</span>
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
                    {t('std1.element.subtitle')}
                  </p>
                  
                  <div className="row">
                    <div className="col-6">
                      {[
                        { key: 'BIM_Beskrivelse', suffix: ' *' },
                        { key: 'BIM_FDV', suffix: ' *' },
                        { key: 'BIM_Tverrfaglig', suffix: ' *' },
                        { key: 'KON_Felles', suffix: ' *' }
                      ].sort((a, b) => t(`propset.${a.key}`).localeCompare(t(`propset.${b.key}`))).map(item => (
                        <div key={item.key} className='bim-objektinfo-badge-1'>
                          <p className='mb-0'>{t(`propset.${item.key}`)}{item.suffix}</p>
                        </div>
                      ))}
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <p className="mt-3 small"><em>{t('std1.element.note1')}</em></p>
                      <p className="mt-3 small"><em>{t('std1.element.note2')}</em></p>
                    </div>
                    
                    <div className="col-6">
                      {[
                        { key: 'KON_Fuger', suffix: ' **' },
                        { key: 'KON_Geometri', suffix: ' **' },
                        { key: 'KON_Peler', suffix: ' **' },
                        { key: 'KON_Stål', suffix: ' **' },
                        { key: 'KON_Sveis', suffix: ' **' },
                        { key: 'KON_Festemidler', suffix: ' **' },
                        { key: 'KON_Tre', suffix: ' **' },
                        { key: 'KON_Armering', suffix: ' **' },
                        { key: 'KON_Betong', suffix: ' **' },
                        { key: 'KON_Spennarmering', suffix: ' **' },
                        { key: 'KON_Lager', suffix: ' **' },
                        { key: 'KON_Løsmasser', suffix: ' **' }
                      ].sort((a, b) => t(`propset.${a.key}`).localeCompare(t(`propset.${b.key}`))).map(item => (
                        <div key={item.key} className='bim-objektinfo-badge-2 w-100'>
                          <p className='mb-0'>{t(`propset.${item.key}`)}{item.suffix}</p>
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
                    {t('std1.element.text')}
                    <br /><br />
                    {t('std1.element.text2')}
                  </p>
                </div>
            </div>
        </div>

      <div className="mb-5 pt-5">
        <h3>
          <span className="text-dark-green">{t('std1.deviations.title')}</span>
        </h3>
        <div className="row position-relative my-4">
            <div className="mb-4">
            <p className="large-text">{t('std1.deviations.intro')}</p>
            <ol className="">
                <li className="my-4 large-text">{t('std1.deviations.naming.title')}</li>
                <p>{t('std1.deviations.naming.text')}</p>
                <p><span style={{fontWeight:"bold"}}>{t('std1.deviations.reason1.title')}</span> {t('std1.deviations.reason1.text')}</p>
                <p><span style={{fontWeight:"bold"}}>{t('std1.deviations.reason2.title')}</span> {t('std1.deviations.reason2.text')}</p>
                <p><span style={{fontWeight:"bold"}}>{t('std1.deviations.reason3.title')}</span> {t('std1.deviations.reason3.text')}</p>
                
                <li className="my-4 large-text">{t('std1.deviations.assembly.title')}</li>
                <p>{t('std1.deviations.assembly.text')}</p>
                <p><span style={{fontWeight:"bold"}}>{t('std1.deviations.assembly.reason1.title')}</span> {t('std1.deviations.assembly.reason1.text')}</p>
                <p><span style={{fontWeight:"bold"}}>{t('std1.deviations.assembly.reason2.title')}</span> {t('std1.deviations.assembly.reason2.text')}</p>
            </ol>
          </div>
                <img src={getImagePath('/Spatial_Breakdown_System_01.png')} alt="Spatial Breakdown System 1" className="img-fluid snacks-image-shadow" />
        </div>
      </div>

      </div>
    </div>
  );
};

export default SnacksStrukturen;
