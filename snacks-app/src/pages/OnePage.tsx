import React from 'react';
import SnacksMain from '../components/SnacksMain';
import StandardiseringDel1 from '../components/StandardiseringDel1';
import SnacksStrukturen from '../components/SnacksStrukturen';
import StandardiseringDel2 from '../components/StandardiseringDel2';
import Historie from '../components/Historie';
import LastNed from '../components/LastNed';
import Begrepsforklaring from '../components/Begrepsforklaring';
import Kontakt from '../components/Kontakt';
import SideNavigation from '../components/SideNavigation';

const OnePage: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-8 col-lg-9 col-xl-10">
          <SnacksMain />
          <StandardiseringDel1 />
          <SnacksStrukturen />
          <StandardiseringDel2 />
          <Historie />
          <LastNed />
          <Begrepsforklaring />
          <Kontakt />
        </div>
        <div className="col-12 col-md-4 col-lg-3 col-xl-2 d-none d-md-block">
          <SideNavigation scrollToSection={scrollToSection} />
        </div>
      </div>
    </div>
  );
};

export default OnePage;
