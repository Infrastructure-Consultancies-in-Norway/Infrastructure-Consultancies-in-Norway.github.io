import React, { useCallback, useEffect, useLayoutEffect } from 'react';
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
import Tilleggsinformasjon from '../components/Tilleggsinformasjon';

type ScrollState = {
  scrollTarget?: string;
  behavior?: ScrollBehavior;
};

const OnePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = useCallback(
    (id: string, behavior: ScrollBehavior = 'smooth', retries = 5) => {
      const element = document.getElementById(id);
      if (element) {
        if (behavior === 'auto') {
          const originalScrollBehavior = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = 'auto';
          const top = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top, behavior: 'auto' });
          setTimeout(() => {
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
          }, 0);
        } else {
          element.scrollIntoView({ behavior, block: 'start' });
        }
        return;
      }

      if (retries > 0) {
        setTimeout(() => scrollToSection(id, behavior, retries - 1), 60);
      }
    },
    []
  );

  useLayoutEffect(() => {
    const state = location.state as ScrollState | null;
    const scrollTarget = state?.scrollTarget;
    const behavior = state?.behavior ?? 'smooth';
    if (scrollTarget) {
      scrollToSection(scrollTarget, behavior);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, scrollToSection]);

  useLayoutEffect(() => {
    if (location.hash) {
      scrollToSection(location.hash.replace('#', ''), 'auto');
    }
  }, [location.hash, scrollToSection]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-9 col-xl-9">
          <SnacksMain scrollToSection={scrollToSection} />
          <StandardiseringDel1 />
          <SnacksStrukturen />
          <StandardiseringDel2 />
          <Historie />
          <LastNed />
          <Begrepsforklaring />
          <Tilleggsinformasjon />
          <Kontakt />
        </div>
        <div className="col-12 col-lg-3 col-xl-3 d-none d-lg-block">
          <SideNavigation scrollToSection={scrollToSection} />
        </div>
      </div>
    </div>
  );
};

export default OnePage;
