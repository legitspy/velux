import React, { useState } from 'react';
import Logo from './common/Logo';
import { Icon } from './common/Icon';

interface HeaderProps {
  onLogoClick: () => void;
  onNavigateToHome: () => void;
  onNavigateToCreateLabel: () => void;
  onNavigateToAbout: () => void;
  currentPage: 'home' | 'tracking' | 'create-label' | 'about';
}

const NavLink: React.FC<{onClick: () => void; isActive: boolean; children: React.ReactNode; isMobile?: boolean;}> = ({ onClick, isActive, children, isMobile = false }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive 
            ? 'bg-brand-primary text-white' 
            : `text-on-surface-secondary hover:bg-gray-100 hover:text-on-surface ${isMobile ? 'text-base' : ''}`
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {children}
    </button>
);


const Header: React.FC<HeaderProps> = ({ onLogoClick, onNavigateToHome, onNavigateToCreateLabel, onNavigateToAbout, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const createNavHandler = (navFunc: () => void) => () => {
    navFunc();
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className="bg-surface shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo onClick={onLogoClick} />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2" aria-label="Main navigation">
            <NavLink onClick={onNavigateToHome} isActive={currentPage === 'home' || currentPage === 'tracking'}>
                Track Shipment
            </NavLink>
            <NavLink onClick={onNavigateToCreateLabel} isActive={currentPage === 'create-label'}>
                Create Label
            </NavLink>
            <NavLink onClick={onNavigateToAbout} isActive={currentPage === 'about'}>
                About Us
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-on-surface-secondary hover:text-on-surface hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <Icon name={isMobileMenuOpen ? 'xMark' : 'menu'} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
            <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                 <NavLink onClick={createNavHandler(onNavigateToHome)} isActive={currentPage === 'home' || currentPage === 'tracking'} isMobile>
                    Track Shipment
                </NavLink>
                <NavLink onClick={createNavHandler(onNavigateToCreateLabel)} isActive={currentPage === 'create-label'} isMobile>
                    Create Label
                </NavLink>
                <NavLink onClick={createNavHandler(onNavigateToAbout)} isActive={currentPage === 'about'} isMobile>
                    About Us
                </NavLink>
            </nav>
        </div>
      )}
    </header>
  );
};

export default Header;