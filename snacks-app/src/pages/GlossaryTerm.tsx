import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { glossaryBySlug } from '../data/glossary';
import { useLanguage } from '../contexts/LanguageContext';
import '../components/Begrepsforklaring.css';

const GlossaryTerm: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { getImagePath } = useLanguage();
  const term = glossaryBySlug[slug.toLowerCase()] ?? null;

  if (!term) {
    return (
      <div className="container my-5 glossary-term-page">
        <p className="glossary-term-summary">Vi fant ikke begrepet du lette etter.</p>
        <Link to="/#begrepsforklaring" className="glossary-back-link">
          &larr; Tilbake til begrepslisten
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5 glossary-term-page">
      <Link to="/#begrepsforklaring" className="glossary-back-link">
        &larr; Tilbake til begrepslisten
      </Link>
      <h1 className="pt-5">{term.heading ?? term.title}</h1>
      <p className="glossary-term-summary large-text-black-bold pt-5">{term.summary}</p>

      {term.image && (
        <div className="glossary-term-image-wrapper text-center">
          <img src={getImagePath(`/${term.image.src}`)} alt={term.image.alt} className="img-fluid glossary-term-image" />
          {term.image.caption && (
            <p className="glossary-term-image-caption">{term.image.caption}</p>
          )}
        </div>
      )}

      {term.details.map((paragraph, index) => (
        <p key={`${term.slug}-paragraph-${index}`} className="large-text glossary-term-paragraph">
          {paragraph}
        </p>
      ))}

      {term.related && term.related.length > 0 && (
        <div className="glossary-related">
          <h2>Se også</h2>
          <ul className="glossary-related-list">
            {term.related.map(relatedSlug => {
              const relatedTerm = glossaryBySlug[relatedSlug];

              if (!relatedTerm) {
                return null;
              }

              return (
                <li key={`${term.slug}-related-${relatedSlug}`}>
                  <Link to={`/begrep/${relatedTerm.slug}`} className="glossary-related-link">
                    {relatedTerm.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GlossaryTerm;
