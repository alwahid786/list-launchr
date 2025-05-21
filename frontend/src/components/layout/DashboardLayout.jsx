import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
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
        if (name === 'giveaway' && pathnames[index + 2] === 'create') formattedName = 'Create Giveaway';
        if (name === 'analytics') {
          if (pathnames[index + 2] === 'performance') formattedName = 'Performance Metrics';
          if (pathnames[index + 2] === 'participants') formattedName = 'Participant Data';
        }
        if (name === 'integrations') {
          if (pathnames[index + 2] === 'email') formattedName = 'Email Services';
          if (pathnames[index + 2] === 'social') formattedName = 'Social Platforms';
        }
        if (name === 'media') formattedName = 'Media Library';
        if (name === 'winners') formattedName = 'Winner Selection';
        if (name === 'templates') formattedName = 'Campaign Templates';
        if (name === 'upgrade') formattedName = 'Upgrade to Pro';
        if (name === 'profile') formattedName = 'Profile';
        if (name === 'notifications') formattedName = 'Notifications';
        if (name === 'support') formattedName = 'Help & Support';
        
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

  return (
    <div className="dashboard-container bg-gray-50">
      {/* Sidebar component */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

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