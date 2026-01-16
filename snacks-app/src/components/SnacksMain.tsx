import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type SnacksMainProps = {
  scrollToSection: (id: string, behavior?: ScrollBehavior) => void;
};

const SnacksMain: React.FC<SnacksMainProps> = ({ scrollToSection }) => {
  const { t, getImagePath } = useLanguage();
  
  return (
    <div id="snacks-main" className="slide-component container my-5">
      <h1>{t('main.title')}</h1>
      <p className="large-text">
        {t('main.intro')}
      </p>
      <div className="row align-items-center my-4">
        <div className="col-md-6 text-center mb-3 mb-md-0">
          <img src={getImagePath('/Personer01.png')} alt="Personer" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <p className="lead">
            <span className="text-light-green fw-bold" onClick={() => scrollToSection('standardisering-del-1')} style={{ cursor: 'pointer' }}>{t('main.std1')}</span><br />
            <span className="text-dark-green fw-bold">{t('main.std1.subtitle')}</span>
          </p>
          <p className="lead">
            <span className="text-light-green fw-bold" onClick={() => scrollToSection('standardisering-del-2')} style={{ cursor: 'pointer' }}>{t('main.std2')}</span><br />
            <span className="text-dark-green fw-bold">{t('main.std2.subtitle1')}</span><br />
            <span className="text-dark-green fw-bold">{t('main.std2.subtitle2')}</span>
          </p>

        </div>
      </div>




    </div>
  );
};

export default SnacksMain;