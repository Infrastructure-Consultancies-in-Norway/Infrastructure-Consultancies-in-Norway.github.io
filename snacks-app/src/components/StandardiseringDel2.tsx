import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const StandardiseringDel2: React.FC = () => {
  const { language, t, getImagePath } = useLanguage();
  const ifcViewerPath = `/ifc-viewer?lang=${language}`;
  
  return (
    <div id="standardisering-del-2" className="slide-component container my-5 pt-5">
      <h2>
        <span className="text-light-green">{t('main.std2')}</span><br />
        <span className="text-dark-green">{t('main.std2.subtitle1')}</span><br />
        <span className="text-dark-green">{t('main.std2.subtitle2')}</span>
      </h2>
      <div className="text-center">
        <img src={getImagePath('/Objekt-navn01.png')} alt="Objekt navn" className="img-fluid" style={{ scale: '75%' }} />
      </div>
      <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
        <Link className="btn btn-success" to={ifcViewerPath}>
          <i className="bi bi-box me-2" aria-hidden="true"></i>
          {t('ifcViewer.open')}
        </Link>
        <a className="btn btn-outline-success" href={ifcViewerPath} target="_blank" rel="noopener noreferrer">
          <i className="bi bi-window me-2" aria-hidden="true"></i>
          {t('ifcViewer.openWindow')}
        </a>
      </div>
    </div>
  );
};

export default StandardiseringDel2;
