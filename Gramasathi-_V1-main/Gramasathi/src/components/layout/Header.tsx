import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Heart, BookOpen, Leaf, Tractor, FileText, Briefcase, HeartHandshake, User, LogIn, Globe, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import { useVoiceContext } from '../../hooks/VoiceContext';

// Create a custom event for sidebar state changes
const createSidebarEvent = (collapsed: boolean) => {
  const event = new CustomEvent('sidebar-state-change', { 
    detail: { collapsed },
    bubbles: true 
  });
  document.dispatchEvent(event);
};

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { speak } = useVoiceContext();

  // Toggle language between English (en) and Telugu (te)
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang); // Change language
  };

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    createSidebarEvent(newState);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    closeMenu();
    speak(t('common.loggedOut'));
  };

  // Effect for setting sidebar state on load
  useEffect(() => {
    // Notify the app of the initial sidebar state
    createSidebarEvent(isSidebarCollapsed);
    
    // Get saved preference if any
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      const isCollapsed = savedState === 'true';
      setIsSidebarCollapsed(isCollapsed);
      createSidebarEvent(isCollapsed);
    }
  }, []);
  
  // Effect for saving sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  // Navigation items grouped by category
  const primaryNavItems = [
    { name: t('nav.health'), path: '/health', icon: <Heart size={20} /> },
    { name: t('nav.edu'), path: '/edu', icon: <BookOpen size={20} /> },
    { name: t('nav.krishi'), path: '/krishi', icon: <Tractor size={20} /> },
    { name: t('nav.rozgar'), path: '/rozgar', icon: <Briefcase size={20} /> },
  ];

  const secondaryNavItems = [
    { name: t('nav.eco'), path: '/eco', icon: <Leaf size={20} /> },
    { name: t('nav.grievance'), path: '/grievance', icon: <FileText size={20} /> },
    { name: t('nav.charity'), path: '/charity', icon: <HeartHandshake size={20} /> },
  ];

  return (
    <>
      {/* Top Bar - Only visible on small screens */}
      <header className="bg-primary-600 text-white shadow-md sticky top-0 z-50 md:hidden">
        <div className="mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <Home className="h-6 w-6 mr-2" />
              <span className="font-heading font-bold text-xl">GramaSathi</span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-700 focus:outline-none"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="bg-primary-700 pb-3 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="border-b border-primary-500 pb-2 mb-2">
                <h3 className="px-3 font-medium text-xs uppercase text-gray-300 mb-1">Primary Services</h3>
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center hover:bg-primary-800 transition-colors
                      ${pathname === item.path ? 'bg-primary-800' : ''}`}
                    onClick={closeMenu}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="border-b border-primary-500 pb-2 mb-2">
                <h3 className="px-3 font-medium text-xs uppercase text-gray-300 mb-1">Additional Services</h3>
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center hover:bg-primary-800 transition-colors
                      ${pathname === item.path ? 'bg-primary-800' : ''}`}
                    onClick={closeMenu}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Auth buttons */}
              <div className="pt-2">
                <h3 className="px-3 font-medium text-xs uppercase text-gray-300 mb-1">Account</h3>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium flex items-center hover:bg-primary-800 transition-colors"
                      onClick={closeMenu}
                    >
                      <User size={20} className="mr-3" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-primary-800 hover:bg-primary-900 transition-colors flex items-center mt-1"
                    >
                      <LogIn size={20} className="mr-3" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium flex items-center hover:bg-primary-800 transition-colors"
                      onClick={closeMenu}
                    >
                      <LogIn size={20} className="mr-3" />
                      <span>{t('nav.login')}</span>
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium flex items-center bg-primary-800 hover:bg-primary-900 transition-colors mt-1"
                      onClick={closeMenu}
                    >
                      <User size={20} className="mr-3" />
                      <span>{t('nav.register')}</span>
                    </Link>
                  </>
                )}

                {/* Language Switch Button (Mobile) */}
                <button
                  onClick={() => {
                    toggleLanguage();
                    closeMenu();
                  }}
                  className="flex items-center w-full text-left mt-4 px-3 py-2 rounded-md text-base font-medium bg-primary-800 hover:bg-primary-900 transition-colors"
                >
                  <Globe size={20} className="mr-3" />
                  <span>{t('common.languageSwitch')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Vertical Sidebar - Hidden on mobile, visible on desktop */}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col bg-primary-600 text-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-primary-500 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link to="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <Home className="h-6 w-6" />
            {!isSidebarCollapsed && (
              <span className="font-heading font-bold text-xl ml-2">GramaSathi</span>
            )}
          </Link>
          {!isSidebarCollapsed && (
            <button 
              onClick={toggleSidebar} 
              className="p-1.5 rounded-md hover:bg-primary-700 focus:outline-none"
              aria-label="Collapse sidebar"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isSidebarCollapsed && (
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 mx-auto mt-2 rounded-md hover:bg-primary-700 focus:outline-none"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={20} className="transform rotate-180" />
          </button>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 py-6 overflow-y-auto">
          {/* Primary Navigation */}
          <div className="mb-6">
            {!isSidebarCollapsed && (
              <h3 className="px-4 mb-2 text-xs font-medium uppercase text-gray-300">
                Primary Services
              </h3>
            )}
            <nav className="space-y-1">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center py-2.5 px-4 ${isSidebarCollapsed ? 'justify-center' : ''} text-sm font-medium rounded-md transition-colors
                   ${pathname === item.path ? 'bg-primary-700' : 'hover:bg-primary-700'}`}
                >
                  <div className={`${isSidebarCollapsed ? '' : 'mr-3'}`}>
                    {item.icon}
                  </div>
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Secondary Navigation */}
          <div className="mb-6">
            {!isSidebarCollapsed && (
              <h3 className="px-4 mb-2 text-xs font-medium uppercase text-gray-300">
                Additional Services
              </h3>
            )}
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center py-2.5 px-4 ${isSidebarCollapsed ? 'justify-center' : ''} text-sm font-medium rounded-md transition-colors
                   ${pathname === item.path ? 'bg-primary-700' : 'hover:bg-primary-700'}`}
                >
                  <div className={`${isSidebarCollapsed ? '' : 'mr-3'}`}>
                    {item.icon}
                  </div>
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section - User Account & Settings */}
        <div className={`mt-auto border-t border-primary-500 pt-2 pb-4 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}>
          {/* Auth buttons */}
          {isAuthenticated ? (
            <div className="space-y-2">
              <Link
                to="/profile"
                className={`flex items-center py-2 ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'} text-sm font-medium rounded-md hover:bg-primary-700 transition-colors`}
              >
                <User size={20} className={isSidebarCollapsed ? '' : 'mr-3'} />
                {!isSidebarCollapsed && <span>{user?.name ? user.name.split(' ')[0] : t('nav.profile')}</span>}
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center py-2 ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'} text-sm font-medium rounded-md w-full hover:bg-primary-700 transition-colors`}
              >
                <LogIn size={20} className={isSidebarCollapsed ? '' : 'mr-3'} />
                {!isSidebarCollapsed && <span>{t('nav.logout')}</span>}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className={`flex items-center py-2 ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'} text-sm font-medium rounded-md hover:bg-primary-700 transition-colors`}
              >
                <LogIn size={20} className={isSidebarCollapsed ? '' : 'mr-3'} />
                {!isSidebarCollapsed && <span>{t('nav.login')}</span>}
              </Link>
              <Link
                to="/register"
                className={`flex items-center py-2 ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'} text-sm font-medium rounded-md hover:bg-primary-700 transition-colors`}
              >
                <User size={20} className={isSidebarCollapsed ? '' : 'mr-3'} />
                {!isSidebarCollapsed && <span>{t('nav.register')}</span>}
              </Link>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center py-2 mt-3 ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'} text-sm font-medium rounded-md hover:bg-primary-700 transition-colors w-full`}
            aria-label={t('common.languageSwitch')}
          >
            <Globe size={20} className={isSidebarCollapsed ? '' : 'mr-3'} />
            {!isSidebarCollapsed && <span>{t('common.languageSwitch')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Header;
