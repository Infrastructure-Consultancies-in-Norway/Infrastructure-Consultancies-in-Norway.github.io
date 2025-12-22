import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const StandardiseringDel1: React.FC = () => {
  const { t, getImagePath } = useLanguage();
  
  return (
    <div id="standardisering-del-1" className="slide-component container my-5 pt-5">
      <h2>
        <span className="text-light-green">{t('main.std1')}</span><br />
      </h2>
      <h3>
        <span className="text-dark-green">{t('main.std1.subtitle')}</span>
      </h3>
      <p className="large-text">
        {t('std1.intro')}
      </p>
      <ul className='large-text'>
        <li>{t('std1.list1')}</li>
        <li>{t('std1.list2')}</li>
        <li>{t('std1.list3')}</li>
        <li>{t('std1.list4')}</li>
        <li>{t('std1.list5')}</li>
      </ul>
      <div className="text-center my-4">
        <img src={getImagePath('/Spatial_Breakdown_System_04.png')} alt="Spatial Breakdown System" className="img-fluid" />
      </div>

      <h2 className="mt-5">{t('std1.purpose.title')}</h2>
      <p className="large-text">
        {t('std1.purpose.text')}
      </p>
    </div>
  );
};

export default StandardiseringDel1;
