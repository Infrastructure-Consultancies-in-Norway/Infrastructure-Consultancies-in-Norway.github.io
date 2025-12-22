import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Tilleggsinformasjon.css';

const Tillegsinformasjon: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div id="tilleggsinformasjon" className="slide-component container mt-5">
      <h2>{t('additional.title')}</h2>
      <div className="tilleggsinformasjon-video mt-5">
        <div className="tilleggsinformasjon-video-header">
          <h3>{t('additional.video.title')}</h3>
        </div>
        <div className="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/PLPpRe9ESuQ" title="BA-Nettverket Presentasjon" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
};

export default Tillegsinformasjon;