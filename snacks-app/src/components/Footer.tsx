import React from 'react';

type Partner = {
  name: string;
  href: string;
  logoSrc: string;
  logoHeight?: number;
  colClass?: string;
  labelClass?: string;
};

const partners: Partner[] = [
  {
    name: 'Sweco',
    href: 'https://www.sweco.no/en/',
    logoSrc:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/sweco_logo_sym.png?raw=true',
    colClass: 'col-6 col-md-2',
    labelClass: 'ms-1',
    logoHeight: 45,
  },
  {
    name: 'Norconsult',
    href: 'https://norconsult.no/',
    logoSrc:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/norconsult_logo_sym.png?raw=true',
  },
  {
    name: 'Aas-Jakobsen',
    href: 'https://www.aas-jakobsen.no/',
    logoSrc:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/aaj_logo_sym.png?raw=true',
  },
  {
    name: 'COWI',
    href: 'https://www.cowi.com',
    logoSrc:
      'https://raw.githubusercontent.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/d4fd067d51ec2dbf353c62025f2853410e951f22/Logos/cowi_logo.svg',
    labelClass: 'ms-1',
    logoHeight: 40,
  },
];

const Footer: React.FC = () => {
  const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';

  return (
    <footer className="footer-snacks text-white text-center p-4 mt-5">
      <div className="container">
        <h5>Et samarbeid mellom:</h5>
        <div className="row justify-content-center">
          {partners.map(({ name, href, logoSrc, logoHeight = 50, colClass = 'col-6 col-md-3', labelClass }) => (
            <div className={`${colClass} text-center logo`} key={name}>
              <a href={href} aria-label={name}>
                <div className="logo-container" style={{ height: `${logoHeight}px` }}>
                  <img src={logoSrc} alt={name} style={{ height: `${logoHeight}px` }} />
                </div>
                <span className={labelClass ?? ''}>{name}</span>
              </a>
            </div>
          ))}
        </div>
        <hr className="my-2" />
        <p className="small mb-0">v{version}</p>
      </div>
    </footer>
  );
};

export default Footer;
