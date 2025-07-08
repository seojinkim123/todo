import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: '오늘' },
  { to: '/planner', label: '플래너' },
  { to: '/stats', label: '통계' },
  { to: '/settings', label: '설정' },
];

const NavBar = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex-1 text-center py-1 px-2 text-sm font-medium ${location.pathname === item.to ? 'text-blue-600' : 'text-gray-500'}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavBar; 