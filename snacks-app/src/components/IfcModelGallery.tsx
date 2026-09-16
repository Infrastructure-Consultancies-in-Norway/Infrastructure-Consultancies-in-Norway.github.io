import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { IFC_LITE_URL } from '../constants/links';
import { VISIBLE_IFC_MODELS } from '../data/ifcModels';
import './IfcViewer.css';
import './IfcModelGallery.css';

const formatFileSize = (bytes: number) => {
  if (!bytes) {
    return '';
  }

  const megabytes = bytes / 1024 / 1024;
  return `${megabytes.toFixed(1)} MB`;
};

const IfcModelGallery: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [failedThumbnails, setFailedThumbnails] = useState<Set<string>>(() => new Set());

  const markThumbnailFailed = (modelId: string) => {
    setFailedThumbnails((current) => {
      if (current.has(modelId)) {
        return current;
      }

      const next = new Set(current);
      next.add(modelId);
      return next;
    });
  };

  return (
    <div id="ifc-viewer" className="slide-component container my-5 pt-5">
      <h2>{t('ifcViewer.galleryTitle')}</h2>
      <p className="ifc-viewer-disclaimer">{t('ifcViewer.disclaimer')}</p>
      <p className="lead">{t('ifcViewer.galleryIntro')}</p>
      <p className="ifc-viewer-credit">
        {t('ifcViewer.creditPrefix')}{' '}
        <a href={IFC_LITE_URL} target="_blank" rel="noreferrer">
          ifcLite
        </a>
      </p>
      <div className="ifc-gallery-grid">
        {VISIBLE_IFC_MODELS.map((model) => {
          const thumbnailFailed = failedThumbnails.has(model.id);

          return (
            <article className="ifc-gallery-card" key={model.id}>
              <Link to={`/ifc-viewer/${model.id}${location.search}`} className="ifc-gallery-card-link">
                <div className="ifc-gallery-thumbnail">
                  {thumbnailFailed ? (
                    <div className="ifc-gallery-thumbnail-placeholder" aria-hidden="true">
                      {model.label.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <img
                      src={model.thumbnailUrl}
                      alt={`${t('ifcViewer.galleryThumbnailAlt')} ${model.label}`}
                      loading="lazy"
                      onError={() => markThumbnailFailed(model.id)}
                    />
                  )}
                </div>
                <div className="ifc-gallery-card-body">
                  <h3>{model.label}</h3>
                  <p className="ifc-gallery-card-meta">
                    {model.fileName}
                    {model.sizeBytes ? ` - ${formatFileSize(model.sizeBytes)}` : ''}
                  </p>
                  <span className="ifc-gallery-card-cta">{t('ifcViewer.galleryOpen')}</span>
                </div>
              </Link>
              <a className="ifc-gallery-card-github" href={model.githubUrl} target="_blank" rel="noreferrer">
                {t('ifcViewer.modelSource')}
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default IfcModelGallery;
