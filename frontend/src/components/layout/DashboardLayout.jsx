import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { currentUser, logout, isPro } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Save sidebar state in localStorage to persist between visits
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('#user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Generate breadcrumbs based on current location
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    let breadcrumbs = [
      { name: 'Dashboard', href: '/dashboard', current: pathnames.length === 1 && pathnames[0] === 'dashboard' }
    ];
    
    if (pathnames.length > 1) {
      let path = '';
      const additionalCrumbs = pathnames.slice(1).map((name, index) => {
        path = `/${pathnames.slice(0, index + 2).join('/')}`;
        
        // Format the breadcrumb name
        let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        if (name === 'campaigns') formattedName = 'My Campaigns';
        if (path === '/dashboard/giveaway/create') formattedName = 'Create Giveaway';
        
        return {
          name: formattedName,
          href: path,
          current: index === pathnames.length - 2
        };
      });
      
      breadcrumbs = [...breadcrumbs, ...additionalCrumbs];
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'My Campaigns',
      href: '/dashboard/campaigns',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      name: 'Create Giveaway',
      href: '/dashboard/giveaway/create',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  // Add upgrade link for free users
  if (!isPro()) {
    navigation.push({
      name: 'Upgrade to Pro',
      href: '/dashboard/upgrade',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    });
  }

  return (
    <div className="dashboard-container bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } shadow-lg flex flex-col lg:z-auto`}
      >
        {/* Sidebar header */}
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} h-16 px-4 border-b border-gray-200`}>
          {!sidebarCollapsed && (
            <span className="text-xl font-headline font-bold text-primary">ListLaunchr</span>
          )}
          {sidebarCollapsed && (
            <span className="text-xl font-headline font-bold text-primary">LL</span>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="dashboard-btn text-gray-500 hover:text-primary p-1 rounded-md hover:bg-gray-100 lg:flex hidden items-center justify-center"
              aria-label="Collapse sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l-7 7 7 7" />
              </svg>
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="dashboard-btn text-gray-500 hover:text-primary p-1 rounded-md hover:bg-gray-100 hidden lg:flex items-center justify-center"
              aria-label="Expand sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="dashboard-btn text-gray-500 lg:hidden ml-auto"
              aria-label="Close mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sidebar navigation */}
        <div className="flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="mt-2 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center ${
                    sidebarCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-2'
                  } text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } transition-all duration-200`}
                >
                  <div className={`${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {item.icon}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                  {sidebarCollapsed && (
                    <span className="absolute left-full ml-3 bg-white border border-gray-200 shadow-md text-gray-700 text-xs px-2 py-1 rounded opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-content flex flex-col overflow-hidden">
        {/* Top navigation */}
        <div className="bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              {/* Mobile menu button - only visible on mobile */}
              <div className="block lg:hidden">
                <button
                  type="button"
                  className="dashboard-btn text-gray-500 hover:text-gray-700 focus:outline-none mr-3"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open mobile menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Breadcrumbs */}
              <nav className="hidden sm:flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.href}>
                      <div className="flex items-center">
                        {index > 0 && (
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                          </svg>
                        )}
                        <Link
                          to={breadcrumb.href}
                          className={`${
                            index > 0 ? 'ml-2' : ''
                          } text-sm font-medium ${
                            breadcrumb.current
                              ? 'text-gray-800'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          aria-current={breadcrumb.current ? 'page' : undefined}
                        >
                          {breadcrumb.name}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* User profile dropdown */}
            <div className="ml-4 flex items-center md:ml-6" id="user-dropdown-container">
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="dashboard-btn flex items-center max-w-xs rounded-full bg-white py-1 px-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center">
                    {currentUser?.picture ? (
                      <img
                        className="h-full w-full object-cover"
                        src={currentUser.picture}
                        alt={currentUser.name}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700">
                        {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden md:block">{currentUser?.name}</span>
                  <svg
                    className={`ml-1 h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-30 border border-gray-100 overflow-hidden">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{currentUser?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                      </div>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-3 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Edit Profile</span>
                      </Link>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-3 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 focus:outline-none w-full">
          <div className="py-6 px-4 sm:px-6 md:px-8 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;