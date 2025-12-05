import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { glossaryItems } from '../data/glossary';
import './Begrepsforklaring.css';

const Begrepsforklaring: React.FC = () => {
  const columns = useMemo(() => {
    const midpoint = Math.ceil(glossaryItems.length / 2);
    return [glossaryItems.slice(0, midpoint), glossaryItems.slice(midpoint)];
  }, []);

  return (
    <div id="begrepsforklaring" className="slide-component container my-5 pt-5">
      <h2>Begrepsforklaring</h2>
      <p className="glossary-intro">
        Velg et begrep for å lese hele forklaringen.
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
                      <span>{term.label}</span>
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
