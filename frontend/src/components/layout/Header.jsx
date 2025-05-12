import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container px-4 sm:px-6">
        <div className="flex justify-between items-center bg-white shadow-lg rounded-full py-3 px-6">
          <Link 
            to="/" 
            className="flex-shrink-0 flex items-center"
          >
            <span className="text-2xl font-headline font-extrabold text-neutral">
              List<span className="text-accent">Launchr</span>
            </span>
          </Link>
          
          <div className="flex items-center justify-center flex-1 mx-4">
            <nav className="hidden md:flex md:justify-center md:items-center bg-gray-50 rounded-full shadow-inner px-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Pricing', path: '/pricing' },
                { name: 'Examples', path: '/examples' }
              ].map((item) => (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`relative group px-5 py-2 mx-1 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-white bg-primary shadow-md hover:bg-blue-700 hover:text-white' 
                      : 'text-neutral-600 hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {!isActive(item.path) && (
                    <span className="absolute inset-0 bg-primary rounded-full opacity-0 transform scale-0 group-hover:opacity-10 group-hover:scale-100 transition-all duration-300"></span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex md:items-center">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/dashboard" 
                  className={`relative group px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive('/dashboard') 
                      ? 'text-white bg-primary shadow-md hover:bg-blue-700 hover:text-white' 
                      : 'text-neutral-600 hover:text-primary bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                  {!isActive('/dashboard') && (
                    <span className="absolute inset-0 bg-primary rounded-full opacity-0 transform scale-0 group-hover:opacity-10 group-hover:scale-100 transition-all duration-300"></span>
                  )}
                </Link>
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full bg-gray-50 text-neutral-600 hover:text-primary hover:bg-gray-100 transition-all duration-300 shadow-sm"
                  >
                    {currentUser.picture ? (
                      <img 
                        src={currentUser.picture} 
                        alt={currentUser.name} 
                        className="w-8 h-8 rounded-full mr-2 border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-primary text-white border-2 border-gray-200">
                        {currentUser.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span>{currentUser.name}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-neutral-400 transition-transform duration-300 group-hover:rotate-180" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 transform group-hover:translate-y-0 translate-y-2 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-neutral-600">{currentUser.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
                    </div>
                    <div className="py-2">
                      <Link 
                        to="/dashboard/profile" 
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100 hover:text-primary transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link 
                        to="/dashboard/campaigns" 
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100 hover:text-primary transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        My Campaigns
                      </Link>
                      {!currentUser.isPro && (
                        <Link 
                          to="/dashboard/upgrade" 
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100 hover:text-cta transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Upgrade to Pro
                        </Link>
                      )}
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 bg-gray-50 text-neutral-600 hover:text-primary hover:bg-gray-100 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-primary text-white hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 border-2 border-blue-100"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full bg-gray-50 text-neutral-600 hover:text-primary hover:bg-gray-100 transition-all duration-300 shadow-sm"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      <div 
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out rounded-l-2xl ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 border-b flex justify-between items-center">
          <span className="text-xl font-headline font-bold text-primary">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full text-neutral-600 hover:text-primary hover:bg-gray-100 transition-all duration-300"
          >
            <svg
              className="block h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="py-4">
          {currentUser && (
            <div className="px-5 py-4 mb-2 border-b bg-gray-50">
              <div className="flex items-center">
                {currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mr-4 border-2 border-white shadow-md">
                    <span className="text-lg font-bold">{currentUser.name?.[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-neutral">{currentUser.name}</div>
                  <div className="text-xs text-neutral-500 truncate">{currentUser.email}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-3 space-y-0.5">
            {[
              { name: 'Home', path: '/' },
              { name: 'Pricing', path: '/pricing' },
              { name: 'Examples', path: '/examples' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-white bg-primary shadow-sm hover:bg-blue-700 hover:text-white'
                    : 'text-neutral-600 hover:text-primary hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
                {isActive(item.path) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>
            ))}
            
            {currentUser ? (
              <>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Dashboard</h3>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive('/dashboard')
                        ? 'text-white bg-primary shadow-sm hover:bg-blue-700 hover:text-white'
                        : 'text-neutral-600 hover:text-primary hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-neutral-600 hover:text-primary hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/campaigns"
                    className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-neutral-600 hover:text-primary hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    My Campaigns
                  </Link>
                  {!currentUser.isPro && (
                    <Link
                      to="/dashboard/upgrade"
                      className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-cta hover:bg-red-50 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Upgrade to Pro
                    </Link>
                  )}
                </div>
                <div className="mt-6 px-3">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6 px-3 pt-4 border-t border-gray-100">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium text-neutral bg-gray-50 hover:bg-gray-100 hover:text-primary transition-all duration-200 shadow-sm mb-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium bg-primary text-white hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;