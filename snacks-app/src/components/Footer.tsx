import React from 'react';

type Partner = {
  name: string;
  href: string;
  logoSrc: string;
  logoWidth: number;
  colClass?: string;
  labelClass?: string;
};

const partners: Partner[] = [
  {
    name: 'Sweco',
    href: 'https://www.sweco.no/en/',
    logoSrc:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/sweco_logo_sym.png?raw=true',
    logoWidth: 40,
    colClass: 'col-6 col-md-2',
    labelClass: 'ms-1',
  },
  {
    name: 'Norconsult',
    href: 'https://norconsult.no/',
    logoSrc:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/norconsult_logo_sym.png?raw=true',
    logoWidth: 50,
  },
  {
    name: 'Aas-Jakobsen',
    href: 'https://www.aas-jakobsen.no/',
    logoSrc:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/aaj_logo_sym.png?raw=true',
    logoWidth: 50,
  },
  {
    name: 'COWI',
    href: 'https://www.cowi.com',
    logoSrc:
      'https://raw.githubusercontent.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/d4fd067d51ec2dbf353c62025f2853410e951f22/Logos/cowi_logo.svg',
    logoWidth: 100,
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="footer-snacks text-white text-center p-4 mt-5">
      <div className="container">
        <h5>Et samarbeid mellom:</h5>
        <div className="row justify-content-center">
          {partners.map(({ name, href, logoSrc, logoWidth, colClass = 'col-6 col-md-3', labelClass }) => (
            <div className={`${colClass} text-center logo`} key={name}>
              <a href={href} aria-label={name}>
                <img src={logoSrc} alt={name} width={logoWidth} />
                <span className={labelClass ?? ''}>{name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
