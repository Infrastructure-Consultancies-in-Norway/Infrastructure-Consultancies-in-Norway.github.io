import React from 'react';

type SideNavigationProps = {
  scrollToSection: (id: string, behavior?: ScrollBehavior) => void;
};

export const sectionNavItems = [
  { id: 'snacks-main', label: 'Hjem' },
  { id: 'standardisering-del-1', label: 'Standardisering 1' },
  // { id: 'snacks-strukturen', label: 'Strukturen' },
  { id: 'standardisering-del-2', label: 'Standardisering 2' },
  { id: 'historie', label: 'Historie' },
  { id: 'last-ned', label: 'Last ned' },
  { id: 'begrepsforklaring', label: 'Begrepsforklaring' },
  { id: 'kontakt', label: 'Kontakt' },
];

const SideNavigation: React.FC<SideNavigationProps> = ({ scrollToSection }) => {
  return (
    <div className="side-navigation-wrapper sticky-top">
      <div className="side-nav-line" aria-hidden="true" />
      <nav className="side-navigation">
        <ul className="nav flex-column">
          {sectionNavItems.map((item) => (
            <li className="nav-item" key={item.id}>
              <button
                type="button"
                className="nav-link side-nav-link large-text"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideNavigation;
