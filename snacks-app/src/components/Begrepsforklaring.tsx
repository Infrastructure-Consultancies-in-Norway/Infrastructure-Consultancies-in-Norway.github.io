import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossaryItems } from '../data/glossary';
import './Begrepsforklaring.css';

const DESKTOP_BREAKPOINT = 992;

const Begrepsforklaring: React.FC = () => {
  const [openInNewTab, setOpenInNewTab] = useState(false);

  useEffect(() => {
    const updatePreference = () => {
      setOpenInNewTab(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    updatePreference();
    window.addEventListener('resize', updatePreference);

    return () => {
      window.removeEventListener('resize', updatePreference);
    };
  }, []);

  const columns = useMemo(() => {
    const midpoint = Math.ceil(glossaryItems.length / 2);
    return [glossaryItems.slice(0, midpoint), glossaryItems.slice(midpoint)];
  }, []);

  return (
    <div id="begrepsforklaring" className="slide-component container my-5">
      <h2>Begrepsforklaring</h2>
      <p className="glossary-intro">
        Velg et begrep for å lese hele forklaringen. På større skjermer åpnes forklaringen i en ny fane.
      </p>
      <div className="row">
        {columns.map((items, columnIndex) => (
          <div className="col-md-6" key={`glossary-column-${columnIndex}`}>
            <ul className="glossary-list">
              {items.map(term => {
                const target = openInNewTab ? '_blank' : undefined;
                const rel = openInNewTab ? 'noopener noreferrer' : undefined;

                return (
                  <li key={term.id} className="glossary-item">
                    <Link
                      to={`/begrep/${term.slug}`}
                      className={`glossary-link${openInNewTab ? ' glossary-link--new-tab' : ''}`}
                      target={target}
                      rel={rel}
                    >
                      <span>{term.label}</span>
                      <span
                        className={`glossary-link-chevron ${
                          openInNewTab ? 'bi bi-arrow-up-right' : 'bi bi-chevron-right'
                        }`}
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
