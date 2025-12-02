import React from 'react';

interface PersonCardProps {
  name: string;
  title: string;
  email: string;
  imageSrc: string;
  offsetTop?: boolean;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, title, email, imageSrc, offsetTop = false }) => {
  return (
    <div className="col-md-6 mb-5">
      <div className={`person ${offsetTop ? 'person-offset' : ''}`}>
        <img src={imageSrc} alt={name} />
        <div className="info">
          <h2>{name}</h2>
          <h5>{title}</h5>
          <div className="email">
            <i className="bi bi-envelope-fill email-icon"></i>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
