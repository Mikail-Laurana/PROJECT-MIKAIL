import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationTabs = () => {
  const location = useLocation();

  // Tab utama
  const mainTabs = [
    { name: 'Android Developer', path: '/android-developer' },
    { name: 'Front End Website', path: '/front-end-website' },
    { name: 'Back End Developer', path: '/back-end-developer' },
    { name: 'Machine Learning', path: '/machine-learning' }
  ];

  // Tab terpisah di kanan
  const rightTab = { name: 'All Class', path: '/all-class' };

  return (
    <div className="flex border-b">
      {/* Tab utama */}
      {mainTabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            location.pathname === tab.path
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          {tab.name}
        </Link>
      ))}

      {/* Tab kanan */}
      <Link
        to={rightTab.path}
        className={`ml-auto px-6 py-3 font-medium text-sm transition-colors ${
          location.pathname === rightTab.path
            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }`}
      >
        {rightTab.name}
      </Link>
    </div>
  );
};

export default NavigationTabs;
