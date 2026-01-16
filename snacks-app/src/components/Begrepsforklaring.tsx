import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { glossaryItems } from '../data/glossary';
import './Begrepsforklaring.css';

const Begrepsforklaring: React.FC = () => {
  const { t, language } = useLanguage();
  const columns = useMemo(() => {
    const midpoint = Math.ceil(glossaryItems.length / 2);
    return [glossaryItems.slice(0, midpoint), glossaryItems.slice(midpoint)];
  }, []);

  return (
    <div id="begrepsforklaring" className="slide-component container my-5 pt-5">
      <h2>{t('glossary.title')}</h2>
      <p className="glossary-intro">
        {t('glossary.intro')}
      </p>
      <div className="row">
        {columns.map((items, columnIndex) => (
          <div className="col-md-6" key={`glossary-column-${columnIndex}`}>
            <ul className="glossary-list">
              {items.map(term => {
                return (
                  <li key={term.id} className="glossary-item">
                    <Link
                      to={`/begrep/${term.slug}`}
                      className="glossary-link"
                    >
                      <span>{term.label[language]}</span>
                      <span
                        className="glossary-link-chevron bi bi-chevron-right"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Begrepsforklaring;
