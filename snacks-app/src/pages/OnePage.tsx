import React, { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SnacksMain from '../components/SnacksMain';
import StandardiseringDel1 from '../components/StandardiseringDel1';
import SnacksStrukturen from '../components/SnacksStrukturen';
import StandardiseringDel2 from '../components/StandardiseringDel2';
import Historie from '../components/Historie';
import LastNed from '../components/LastNed';
import Begrepsforklaring from '../components/Begrepsforklaring';
import Kontakt from '../components/Kontakt';
import SideNavigation from '../components/SideNavigation';

type ScrollState = {
  scrollTarget?: string;
};

const OnePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const scrollTarget = (location.state as ScrollState | null)?.scrollTarget;
    if (scrollTarget) {
      scrollToSection(scrollTarget);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, scrollToSection]);

  useEffect(() => {
    if (location.hash) {
      scrollToSection(location.hash.replace('#', ''));
    }
  }, [location.hash, scrollToSection]);

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
