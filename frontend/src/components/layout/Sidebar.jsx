import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { currentUser, isPro } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

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

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location, setMobileOpen]);

  // Navigation items definition with sections and nested items
  const navigationItems = [
    // Dashboard Overview
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      tooltip: "Overview of your campaigns and performance",
    },
    
    // Campaign Management Section
    {
      section: "Campaign Management",
      items: [
        {
          name: "My Campaigns",
          href: "/dashboard/campaigns",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ),
          tooltip: "View and manage all your giveaway campaigns",
        },
        {
          name: "Create Giveaway",
          href: "/dashboard/giveaway/create",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
          proRequired: true,
          tooltip: "Create a new customized giveaway campaign",
        },
        {
          name: "Campaign Templates",
          href: "/dashboard/templates",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          ),
          proRequired: true,
          tooltip: "Save and reuse campaign designs",
        },
        {
          name: "Winner Selection",
          href: "/dashboard/winners",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          tooltip: "Select and manage winners for your campaigns",
        },
      ],
    },
    
    // Analytics Section
    {
      section: "Analytics",
      items: [
        {
          name: "Performance Metrics",
          href: "/dashboard/analytics/performance",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          proRequired: true,
          tooltip: "View detailed performance analytics for your campaigns",
        },
        {
          name: "Participant Data",
          href: "/dashboard/analytics/participants",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          proRequired: true,
          tooltip: "Analyze participant demographics and behavior",
        },
      ],
    },
    
    // Integrations Section
    {
      section: "Integrations",
      items: [
        {
          name: "Email Services",
          href: "/dashboard/integrations/email",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          proRequired: true,
          tooltip: "Connect with email marketing platforms",
        },
        {
          name: "Social Platforms",
          href: "/dashboard/integrations/social",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ),
          proRequired: true,
          tooltip: "Connect with social media platforms",
        },
      ],
    },
    
    // Media Library
    {
      name: "Media Library",
      href: "/dashboard/media",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      proRequired: true,
      tooltip: "Upload and manage images for your campaigns",
    },
    
    // Account Settings Section
    {
      section: "Account",
      items: [
        {
          name: "Profile",
          href: "/dashboard/profile",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          tooltip: "Manage your account profile",
        },
        {
          name: "Notifications",
          href: "/dashboard/notifications",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          ),
          tooltip: "Manage your notification preferences",
        },
        {
          name: "Billing & Subscription",
          href: "/dashboard/upgrade",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          ),
          tooltip: "Manage your subscription and billing information",
        },
      ],
    },
    
    // Help & Support
    {
      name: "Help & Support",
      href: "/dashboard/support",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      tooltip: "Get help and contact support",
    },
  ];

  // Add upgrade link for free users
  const upgradeLink = !isPro() ? {
    name: "Upgrade to Pro",
    href: "/dashboard/upgrade",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    highlight: true,
    tooltip: "Unlock premium features with a Pro subscription",
  } : null;

  // Render a regular navigation item
  const renderNavItem = (item, isNested = false) => {
    // Skip Pro features for free users if hidden flag is true
    if (item.proRequired && !isPro() && item.hide) {
      return null;
    }

    const isActive = location.pathname === item.href || 
      (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
    
    return (
      <Link
        key={item.name}
        to={item.href}
        className={`group flex items-center ${
          sidebarCollapsed ? 'justify-center px-3 py-3' : isNested ? 'px-4 py-2 pl-8' : 'px-4 py-2'
        } text-sm font-medium rounded-md ${
          isActive
            ? 'bg-gray-100 text-gray-900 font-medium'
            : item.highlight 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        } transition-all duration-200 relative`}
      >
        <div className={`${
          isActive 
            ? 'text-primary' 
            : item.highlight 
              ? 'text-white' 
              : 'text-gray-400 group-hover:text-gray-500'
        }`}>
          {item.icon}
        </div>
        
        {/* Item name (visible when sidebar is expanded) */}
        {!sidebarCollapsed && (
          <span className={`ml-3 flex items-center ${item.highlight ? 'text-white' : ''}`}>
            {item.name}
            {item.proRequired && !isPro() && (
              <span className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Pro
              </span>
            )}
          </span>
        )}
        
        {/* Tooltip (visible when sidebar is collapsed) */}
        {sidebarCollapsed && (
          <span className="z-50 absolute left-full ml-3 bg-white border border-gray-200 shadow-xl text-gray-700 text-xs px-3 py-2 rounded-md opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none w-max">
            <div className="font-medium mb-1">{item.name}</div>
            {item.tooltip && <div className="text-xs text-gray-500">{item.tooltip}</div>}
            {item.proRequired && !isPro() && (
              <div className="text-xs mt-1 flex items-center text-blue-600 font-medium">
                <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Pro feature - Upgrade to access
              </div>
            )}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      
      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } shadow-lg flex flex-col lg:z-auto overflow-hidden`}
      >
        {/* Sidebar header with logo and collapse toggle */}
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} h-16 px-4 border-b border-gray-200`}>
          {!sidebarCollapsed && (
            <span className="text-xl font-headline font-bold text-primary">ListLaunchr</span>
          )}
          {sidebarCollapsed && (
            <span className="text-xl font-headline font-bold text-primary">LL</span>
          )}
          
          {/* Collapse/Expand toggle button */}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="text-gray-500 hover:text-primary p-1 rounded-md hover:bg-gray-100 lg:flex hidden items-center justify-center"
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
              className="text-gray-500 hover:text-primary p-1 rounded-md hover:bg-gray-100 hidden lg:flex items-center justify-center"
              aria-label="Expand sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Mobile close button */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-500 lg:hidden"
              aria-label="Close mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="mt-2 px-2 space-y-1">
            {/* Main navigation items */}
            {navigationItems.map((item) => {
              // Render section with nested items
              if (item.section) {
                return (
                  <div key={item.section} className="pt-5 first:pt-0">
                    {/* Section header (only visible when expanded) */}
                    {!sidebarCollapsed && (
                      <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.section}
                      </h3>
                    )}
                    {/* Section items */}
                    <div className="space-y-1">
                      {item.items.map((subItem) => renderNavItem(subItem, true))}
                    </div>
                  </div>
                );
              }
              
              // Render regular navigation item
              return renderNavItem(item);
            })}
            
            {/* Upgrade link for free users (placed at bottom) */}
            {upgradeLink && (
              <div className="pt-6">
                {renderNavItem(upgradeLink)}
              </div>
            )}
          </nav>
        </div>
        
        {/* User profile preview (bottom of sidebar) */}
        {!sidebarCollapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
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
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {isPro() ? (
                    <span className="text-blue-600 font-medium flex items-center">
                      <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Pro Plan
                    </span>
                  ) : (
                    'Free Plan'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;