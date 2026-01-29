import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { N400_APPROVAL_URL } from '../constants/links';
import './ValidationModal.css';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  

  return (
    <div className="validation-modal-backdrop" onClick={handleBackdropClick}>
      <div className="validation-modal-content">
        <button 
          className="validation-modal-close" 
          onClick={onClose}
          aria-label={t('validation.modal.close')}
        >
          ×
        </button>
        <div className="validation-box-green">
          <p className="validation-box-text">
            {t('validation.n400.text')}
          </p>
          <img 
            src="/N400_Figur.png" 
            alt="N400 Logo" 
            className="validation-box-logo-n400"
          />
          <a href={N400_APPROVAL_URL} className="validation-box-link" target="_blank" rel="noopener noreferrer">
            {t('validation.n400.link')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
