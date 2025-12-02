import React from 'react';
import PersonCard from './PersonCard';
import { people } from '../data/people';

const Kontakt: React.FC = () => {
  return (
    <div id="kontakt" className="slide-component container my-5">
      <h2>Kontakt</h2>
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
