import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type SideNavigationProps = {
  scrollToSection: (id: string, behavior?: ScrollBehavior) => void;
};

export const sectionNavItems = [
  { id: 'snacks-main', label: 'Hjem', translationKey: 'nav.home' },
  { id: 'standardisering-del-1', label: 'Standardisering del 1', translationKey: 'nav.standardization1' },
  // { id: 'snacks-strukturen', label: 'Strukturen' },
  { id: 'standardisering-del-2', label: 'Standardisering del 2', translationKey: 'nav.standardization2' },
  { id: 'historie', label: 'Historie', translationKey: 'nav.history' },
  { id: 'last-ned', label: 'Last ned', translationKey: 'nav.download' },
  { id: 'begrepsforklaring', label: 'Begrepsforklaring', translationKey: 'nav.glossary' },
  { id: 'tilleggsinformasjon', label: 'Tilleggsinformasjon', translationKey: 'nav.additional' },
  { id: 'kontakt', label: 'Kontakt', translationKey: 'nav.contact' },
];

const SideNavigation: React.FC<SideNavigationProps> = ({ scrollToSection }) => {
  const { t } = useLanguage();
  
  return (
    <div className="side-navigation-wrapper sticky-top">
      <div className="side-nav-line" aria-hidden="true" />
      <nav className="side-navigation">
        <ul className="nav flex-column">
          {sectionNavItems.map((item) => (
            <li className="nav-item" key={item.id}>
              <button
                type="button"
                className="nav-link side-nav-link large-text-grey"
                onClick={() => scrollToSection(item.id)}
              >
                {t(item.translationKey)}
              </button>
            </li>
          ))}
        </ul>
      </nav>




    </div>
    
  );
};

export default SideNavigation;
