import React from 'react';
import './LastNed.css';

const downloadItems = [
  {
    id: 1,
    title: 'Rapport: Behovsanalyse (PDF)',
    subtitle: 'Del 1: Behovsanalyse',
    image: '/dl1.png',
    href: '#'
  },
  {
    id: 2,
    title: 'Rapport: Sluttrapport (PDF)',
    subtitle: 'Del 2: Sluttrapport',
    image: '/dl2.png',
    href: '#'
  },
  {
    id: 3,
    title: 'Rapport: XXX (PDF)',
    subtitle: 'Del 3: Egenskaper',
    image: '/dl3.png',
    href: '#'
  },
  {
    id: 4,
    title: 'Rapport: XXX (PDF)',
    subtitle: 'Del 4: Egenskapsskjema og verdier',
    image: '/dl4.png',
    href: '#'
  },
  {
    id: 5,
    title: 'SNACKS egenskaper (Excel)',
    subtitle: 'Excel-mal',
    image: '/dl5.png',
    href: '#'
  },
  {
    id: 6,
    title: 'Eksempelmodell (IFC)',
    subtitle: 'IFC-eksempel',
    image: '/dl6.png',
    href: '#'
  },
  {
    id: 7,
    title: 'Rapport: XXX (PDF)',
    subtitle: 'Tilgjengelig snart',
    image: '/dl7.png',
    href: '#'
  },
  {
    id: 8,
    title: 'Rapport: XXX (PDF)',
    subtitle: 'Tilgjengelig snart',
    image: '/dl8.png',
    href: '#'
  }
];

const LastNed: React.FC = () => {
  return (
    <div id="last-ned" className="slide-component container my-5">
      <h2>Last ned</h2>
      <div className="download-grid">
        {downloadItems.map(item => (
          <a key={item.id} href={item.href} className="download-card" aria-label={`Last ned ${item.title}`}>
            <div className="download-card-image-wrapper">
              <img src={item.image} alt={item.title} className="download-card-image" />
            </div>
            <div className="download-card-body">
              <p className="download-card-title mb-1">{item.title}</p>
              <p className="download-card-subtitle mb-0">{item.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default LastNed;
