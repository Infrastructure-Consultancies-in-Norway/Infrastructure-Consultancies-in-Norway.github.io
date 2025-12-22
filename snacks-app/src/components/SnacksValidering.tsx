import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './SnacksValidering.css';
import { N400_APPROVAL_URL } from '../constants/links';

const SnacksValidering: React.FC = () => {
  const { t } = useLanguage();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const validering = document.getElementById('snacks-validering');
      if (!validering) return;

      const rect = validering.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableDistance = documentHeight - windowHeight;
      const scrollProgress = scrollY / scrollableDistance;
      
      // Fade out starting at 50% scroll, fully faded by 100%
      const fadeStartPercent = 0.01;
      const fadeEndPercent = 0.2;
      
      if (scrollProgress < fadeStartPercent) {
        setOpacity(1);
      } else if (scrollProgress < fadeEndPercent) {
        // Gradually fade from 1 to 0.05 between 50% and 70%
        const fadeRange = fadeEndPercent - fadeStartPercent;
        const currentFadeProgress = (scrollProgress - fadeStartPercent) / fadeRange;
        const newOpacity = Math.max(0.05, 1 - currentFadeProgress);
        setOpacity(newOpacity);
      } else {
        setOpacity(0.0); // Almost invisible when past 70%
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div 
      id="snacks-validering" 
      className="snacks-validering-sticky py-5"
      style={{ opacity }}
    >
        {/* First box - N400 with light green border */}
        <div className="validation-box-green">
          <p className="validation-box-text">
            {t('validation.n400.text')}
          </p>
          <img 
            src="/N400_Figur.png" 
            alt="N400 Logo" 
            className="validation-box-logo-n400"
          />
          <a href={N400_APPROVAL_URL} className="validation-box-link">
            {t('validation.n400.link')}
          </a>
        </div>

        {/* Second box - Vegvesen with grey border */}
        <div className="validation-box-grey">
          <img 
            src="/vegvesen-logo-farger-pos-rgb.webp" 
            alt="Statens vegvesen logo" 
            className="validation-box-logo-svv"
          />
          <p className="validation-box-text validation-box-text-color-grey">
            {t('validation.svv.text')}
          </p>
        </div>
    </div>
  );
}       

export default SnacksValidering;