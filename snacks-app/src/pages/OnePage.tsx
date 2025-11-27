import React from 'react';
import SnacksMain from '../components/SnacksMain';
import StandardiseringDel1 from '../components/StandardiseringDel1';
import SnacksStrukturen from '../components/SnacksStrukturen';
import StandardiseringDel2 from '../components/StandardiseringDel2';
import Historie from '../components/Historie';
import LastNed from '../components/LastNed';
import Begrepsforklaring from '../components/Begrepsforklaring';
import Kontakt from '../components/Kontakt';

const OnePage: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <SnacksMain />
          <StandardiseringDel1 />
          <SnacksStrukturen />
          <StandardiseringDel2 />
          <Historie />
          <LastNed />
          <Begrepsforklaring />
          <Kontakt />
        </div>
        <div className="col-md-2 d-none d-md-block">
          <nav className="position-fixed top-50 translate-middle-y end-0 pe-3">
            <ul className="nav flex-column text-end">
              <li className="nav-item">
                <button className="btn btn-link nav-link text-dark" onClick={() => scrollToSection('snacks-main')}>Hjem</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-dark" onClick={() => scrollToSection('standardisering-del-1')}>Standardisering 1</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-dark" onClick={() => scrollToSection('snacks-strukturen')}>Strukturen</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-dark" onClick={() => scrollToSection('standardisering-del-2')}>Standardisering 2</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-dark" onClick={() => scrollToSection('historie')}>Historie</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-dark" onClick={() => scrollToSection('last-ned')}>Last ned</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-dark" onClick={() => scrollToSection('begrepsforklaring')}>Begrepsforklaring</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link text-dark" onClick={() => scrollToSection('kontakt')}>Kontakt</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default OnePage;
