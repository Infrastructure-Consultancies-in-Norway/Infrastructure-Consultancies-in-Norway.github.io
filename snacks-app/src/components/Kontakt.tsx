import React from 'react';
import PersonCard from './PersonCard';
import { people } from '../data/people';

const Kontakt: React.FC = () => {
  return (
    <div id="kontakt" className="slide-component container my-5">
      <h2 style={{marginBottom: '30px'}}>Kontakt</h2>
      <div className="row">
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
