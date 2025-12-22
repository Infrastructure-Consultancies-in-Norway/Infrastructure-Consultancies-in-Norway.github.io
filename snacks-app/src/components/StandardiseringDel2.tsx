import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const StandardiseringDel2: React.FC = () => {
  const { t, getImagePath } = useLanguage();
  
  return (
    <div id="standardisering-del-2" className="slide-component container my-5 pt-5">
      <h2>
        <span className="text-light-green">{t('main.std2')}</span><br />
        <span className="text-dark-green">{t('main.std2.subtitle1')}</span><br />
        <span className="large-text">{t('main.std2.subtitle2')}</span>
      </h2>
      <div className="text-center">
        <img src={getImagePath('/Objekt-navn01.png')} alt="Objekt navn" className="img-fluid" style={{ scale: '75%' }} />
      </div>
    </div>
  );
};

export default StandardiseringDel2;
