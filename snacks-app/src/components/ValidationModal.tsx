import React from 'react';
import { N400_APPROVAL_URL } from '../constants/links';
import './ValidationModal.css';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose }) => {
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
          aria-label="Lukk"
        >
          ×
        </button>
        <div className="validation-box-green">
          <p className="validation-box-text">
            SNACKS-strukturen er godkjent for bruk i modellbaserte leveranser i henhold til N400
          </p>
          <img 
            src="/N400_Figur.png" 
            alt="N400 Logo" 
            className="validation-box-logo-n400"
          />
          <a href={N400_APPROVAL_URL} className="validation-box-link">
            Les mer her
          </a>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
