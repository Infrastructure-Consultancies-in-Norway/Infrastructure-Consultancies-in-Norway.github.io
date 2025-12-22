import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PersonCard from './PersonCard';
import { people } from '../data/people';

const Kontakt: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div id="kontakt" className="slide-component container my-5">
      <h2>{t('contact.title')}</h2>
      <p className="lead">
        {t('contact.intro')}
      </p>
{/* Link to Github project https://github.com/orgs/Infrastructure-Consultancies-in-Norway/projects/1 */}
      <div className="download-github-link">
        <a
          href="https://github.com/orgs/Infrastructure-Consultancies-in-Norway/projects/1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{t('contact.github')}</span>
          <span aria-hidden="true" className="download-github-link-icon bi bi-arrow-up-right" />
        </a>
      </div>

      <div className="row mt-5">
        {people.map((person, index) => (
          <PersonCard
            key={person.email}
            name={person.name}
            title={person.title}
            email={person.email}
            imageSrc={person.imageSrc}
            offsetTop={index % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Kontakt;
