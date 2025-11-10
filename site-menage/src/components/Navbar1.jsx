import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Added
import { adminLogout } from '../api-supabase';
import LanguageSwitcher from './LanguageSwitcher'; // Added
import './Navbar1.css';

export default function Navbar1() {
  const { t, i18n } = useTranslation(); // Added i18n for language detection
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('user') || localStorage.getItem('adminToken')));
  const [isLangOpen, setIsLangOpen] = useState(false);
  const handleChangeLanguage = (lng) => {
    try {
      i18n.changeLanguage(lng);
    } finally {
      setIsLangOpen(false);
    }
  };
  const location = useLocation();
  const navigate = useNavigate();

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function closeMenu() {
    setIsOpen(false);
    setIsLangOpen(false);
  }

  async function handleLogout() {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        try {
          await adminLogout(adminToken);
        } catch (_) {
          // ignore API errors, proceed to local logout
        }
      }

      // Clear possible auth storages (user + admin)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      sessionStorage.removeItem('token');
    } finally {
      closeMenu();
      navigate('/');
    }
  }

  useEffect(() => {
    // Close menu on route change
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    // Prevent body scroll when menu is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    // Close menu when clicking outside or pressing Escape
    const handleClickOutside = (event) => {
      if (isOpen) {
        const navbar = document.querySelector('.navbar1');
        const drawer = document.querySelector('.navbar1__drawer');
        
        // Check if click is outside navbar and drawer
        if (navbar && drawer && 
            !navbar.contains(event.target) && 
            !drawer.contains(event.target)) {
          closeMenu();
        }
      }
    };

    const handleKeyDown = (event) => {
      if (isOpen && event.key === 'Escape') {
        closeMenu();
      }
    };

    // Add event listeners when menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Track auth changes via storage events or route changes
    const syncAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('user') || localStorage.getItem('adminToken')));
    };
    window.addEventListener('storage', syncAuth);
    syncAuth();
    return () => window.removeEventListener('storage', syncAuth);
  }, [location.pathname]);

  // Set HTML lang and direction based on language
  useEffect(() => {
    const lang = i18n.language || 'fr';
    const langCode = lang.split(/[-_]/)[0].toLowerCase();
    const isRTL = langCode === 'ar';
    
    // Set HTML lang attribute
    document.documentElement.setAttribute('lang', langCode);
    
    // Set direction
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.style.direction = isRTL ? 'rtl' : 'ltr';
    document.documentElement.style.textAlign = isRTL ? 'right' : 'left';
  }, [i18n.language]);

  // Determine if we're in RTL mode (Arabic)
  const isRTL = i18n.language === 'ar';

  return (
    <header
      className={`navbar1 ${isScrolled ? 'scrolled' : ''} ${isRTL ? 'rtl' : ''}`}
      role="banner"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 999999,
        background: 'rgba(255,255,255,0.95)',
        display: 'flex',
        visibility: 'visible',
        opacity: 1
      }}
    >
      <div className={`navbar1__inner ${isRTL ? 'rtl-inner' : ''}`}>
        {/* Burger menu - hidden on desktop, visible on mobile */}
        <button
          type="button"
          className={`navbar1__hamburger ${isOpen ? 'is-open' : ''}`}
          aria-label="Menu"
          aria-expanded={isOpen}
          aria-controls="navbar1-drawer"
          onClick={toggleMenu}
        >
          <span className="bar bar-1"/>
          <span className="bar bar-2"/>
          <span className="bar bar-3"/>
        </button>

        {/* Logo - first in RTL layout */}
        <Link 
          to="/" 
          className={`navbar1__brand ${isRTL ? 'rtl-brand' : ''}`} 
          aria-label="SolutionPourMaintenant - Accueil" 
          onClick={closeMenu}
        >
          <span className="navbar1__title">ForNowSolution</span>
        </Link>

        {/* Navigation menu - links in normal order */}
        <nav className={`navbar1__nav ${isRTL ? 'rtl-nav' : ''}`} aria-label="Navigation principale">
          <ul className={`navbar1__links ${isRTL ? 'rtl' : ''}`}>
            {/* RTL: Logo → الرئيسية → جميع خدماتنا → المتجر → الموظفين → ملفي الشخصي → [langue + login/logout] */}
            {/* Normal order for RTL (links read naturally right to left) */}
            {isRTL ? (
              <>
                {/* Navigation links in normal order */}
                <li><Link to="/" onClick={closeMenu}>{t('nav.home')}</Link></li>
                <li><Link to="/tous-les-services" onClick={closeMenu}>{t('nav.all_services')}</Link></li>
                <li><Link to="/shop" onClick={closeMenu}>{t('nav.shop')}</Link></li>
                <li><Link to="/employees/register" onClick={closeMenu}>{t('nav.employees')}</Link></li>
                <li><Link to="/support" onClick={closeMenu}>الدعم</Link></li>
                {isLoggedIn && (
                  <li><Link to="/profile" onClick={closeMenu}>{t('nav.profile')}</Link></li>
                )}
                
                {/* Icons at the end */}
                <li className="language-switcher-item" style={{ position:'relative', marginLeft: 'auto', marginRight: '0' }}>
                  <button
                    type="button"
                    className="icon-btn lang-btn"
                    title={t('nav.languages', 'Languages')}
                    aria-label={t('nav.languages', 'Languages')}
                    aria-expanded={isLangOpen}
                    onClick={() => setIsLangOpen(v => !v)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages">
                      <path d="m5 8 6 6" />
                      <path d="m4 14 6-6 2-3" />
                      <path d="M2 5h12" />
                      <path d="M7 2h1" />
                      <path d="m22 22-5-10-5 10" />
                      <path d="M14 18h6" />
                    </svg>
                  </button>
                  {isLangOpen && (
                    <div style={{ 
                      position:'absolute', 
                      top:'110%', 
                      right: 'auto', 
                      left: 0, 
                      zIndex:100000,
                      background:'#fff',
                      border:'1px solid #e5e7eb',
                      borderRadius:12,
                      padding:8,
                      boxShadow:'0 10px 25px rgba(0,0,0,0.12)'
                    }}>
                      <div style={{display:'flex', flexDirection:'column', minWidth:180}}>
                        {[
                          { code:'ar', label:'العربية SA' },
                          { code:'fr', label:'Français FR' },
                          { code:'en', label:'English EN' },
                        ].map(({code,label}) => (
                          <button key={code}
                            type="button"
                            onClick={() => handleChangeLanguage(code)}
                            className={`lang-option ${i18n.language.startsWith(code) ? 'active' : ''}`}
                            style={{
                              display:'flex', alignItems:'center', justifyContent:'space-between',
                              gap:8, padding:'8px 10px', border:'none', background:'transparent',
                              cursor:'pointer', borderRadius:8, color:'#0f172a'
                            }}
                          >
                            <span>{label}</span>
                            {i18n.language.startsWith(code) && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
                {!isLoggedIn && (
                  <li style={{ marginLeft: 'auto', marginRight: '0' }}>
                    <button
                      type="button"
                      className="icon-btn login-btn"
                      title={t('nav.login')}
                      aria-label={t('nav.login')}
                      onClick={() => { closeMenu(); navigate('/login-register'); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in">
                        <path d="m10 17 5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      </svg>
                    </button>
                  </li>
                )}
                {isLoggedIn && (
                  <li style={{ marginLeft: 'auto', marginRight: '0' }}>
                    <button
                      type="button"
                      className="icon-btn logout-btn"
                      title={t('nav.logout')}
                      aria-label={t('nav.logout')}
                      onClick={handleLogout}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      </svg>
                    </button>
                  </li>
                )}
              </>
            ) : (
              <>
                {/* LTR: normal order */}
                <li><Link to="/" onClick={closeMenu}>{t('nav.home')}</Link></li>
                <li><Link to="/tous-les-services" onClick={closeMenu}>{t('nav.all_services')}</Link></li>
                <li><Link to="/shop" onClick={closeMenu}>{t('nav.shop')}</Link></li>
                <li><Link to="/employees/register" onClick={closeMenu}>{t('nav.employees')}</Link></li>
                <li><Link to="/support" onClick={closeMenu}>Support</Link></li>
                {isLoggedIn && (
                  <li><Link to="/profile" onClick={closeMenu}>{t('nav.profile')}</Link></li>
                )}
                
                {/* Language switcher - right side in LTR */}
                <li className="language-switcher-item" style={{ position:'relative', marginLeft: 'auto', marginRight: '0' }}>
              <button
                type="button"
                className="icon-btn lang-btn"
                title={t('nav.languages', 'Languages')}
                aria-label={t('nav.languages', 'Languages')}
                aria-expanded={isLangOpen}
                onClick={() => setIsLangOpen(v => !v)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages">
                  <path d="m5 8 6 6" />
                  <path d="m4 14 6-6 2-3" />
                  <path d="M2 5h12" />
                  <path d="M7 2h1" />
                  <path d="m22 22-5-10-5 10" />
                  <path d="M14 18h6" />
                </svg>
              </button>
              {isLangOpen && (
                <div style={{ 
                  position:'absolute', 
                  top:'110%', 
                  right: isRTL ? 'auto' : 0, 
                  left: isRTL ? 0 : 'auto', 
                  zIndex:100000,
                  background:'#fff',
                  border:'1px solid #e5e7eb',
                  borderRadius:12,
                  padding:8,
                  boxShadow:'0 10px 25px rgba(0,0,0,0.12)'
                }}>
                  <div style={{display:'flex', flexDirection:'column', minWidth:180}}>
                    {[
                      { code:'ar', label:'العربية SA' },
                      { code:'fr', label:'Français FR' },
                      { code:'en', label:'English EN' },
                    ].map(({code,label}) => (
                      <button key={code}
                        type="button"
                        onClick={() => handleChangeLanguage(code)}
                        className={`lang-option ${i18n.language.startsWith(code) ? 'active' : ''}`}
                        style={{
                          display:'flex', alignItems:'center', justifyContent:'space-between',
                          gap:8, padding:'8px 10px', border:'none', background:'transparent',
                          cursor:'pointer', borderRadius:8, color:'#0f172a'
                        }}
                      >
                        <span>{label}</span>
                        {i18n.language.startsWith(code) && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
            {/* Login/Logout buttons - always on the right side (left in RTL) */}
            {!isLoggedIn && (
              <li style={{ marginLeft: isRTL ? '0' : 'auto', marginRight: isRTL ? '8px' : '0' }}>
                <button
                  type="button"
                  className="icon-btn login-btn"
                  title={t('nav.login')}
                  aria-label={t('nav.login')}
                  onClick={() => { closeMenu(); navigate('/login-register'); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in">
                    <path d="m10 17 5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  </svg>
                </button>
              </li>
            )}
            {isLoggedIn && (
              <li style={{ marginLeft: isRTL ? '0' : 'auto', marginRight: isRTL ? '8px' : '0' }}>
                <button
                  type="button"
                  className="icon-btn logout-btn"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                  onClick={handleLogout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                </button>
              </li>
            )}
              </>
            )}
          </ul>
        </nav>
      </div>

      <div
        id="navbar1-drawer"
        className={`navbar1__drawer ${isOpen ? 'open' : ''} ${isRTL ? 'rtl' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="navbar1__drawer-inner">
          <div className="navbar1__drawer-header" style={{ 
            flexDirection: isRTL ? 'row-reverse' : 'row' 
          }}>
            <h2>{t('nav.menu', 'Menu')}</h2>
            <button
              type="button"
              className="navbar1__close-btn"
              aria-label="Fermer le menu"
              onClick={closeMenu}
            >
              ×
            </button>
          </div>
          <ul className="navbar1__drawer-links">
            <li><Link to="/" onClick={closeMenu}>{t('nav.home')}</Link></li>
            <li><Link to="/tous-les-services" onClick={closeMenu}>{t('nav.all_services')}</Link></li>
            <li><Link to="/shop" onClick={closeMenu}>{t('nav.shop')}</Link></li>
            <li><Link to="/employees/register" onClick={closeMenu}>{t('nav.employees')}</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>{t('nav.contact')}</Link></li>
            <li><Link to="/support" onClick={closeMenu}>{isRTL ? 'الدعم' : 'Support'}</Link></li>
            <li><Link to="/gallery" onClick={closeMenu}>{t('nav.gallery')}</Link></li>
            <li><Link to="/info" onClick={closeMenu}>{t('nav.info')}</Link></li>
            <li><Link to="/temoignages" onClick={closeMenu}>{t('nav.testimonials')}</Link></li>
            {isLoggedIn && (
              <li><Link to="/profile" onClick={closeMenu}>{t('nav.profile')}</Link></li>
            )}
            {!isLoggedIn && (
              <li>
                <button
                  type="button"
                  className="icon-btn login-btn"
                  title={t('nav.login')}
                  aria-label={t('nav.login')}
                  onClick={() => { closeMenu(); navigate('/login-register'); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in">
                    <path d="m10 17 5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  </svg>
                </button>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button
                  type="button"
                  className="icon-btn logout-btn"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                  onClick={handleLogout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                </button>
              </li>
            )}
            <li className="language-switcher-item">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
        <button className="navbar1__backdrop" aria-label="Fermer le menu" onClick={closeMenu}/>
      </div>
    </header>
  );
}
