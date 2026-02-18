
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants.tsx';
import Logo from './Logo';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Logo className="scale-90 sm:scale-100 origin-left" />
          
          <nav className="hidden md:flex items-center space-x-10">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.label}
                href={item.href}
                className="text-sm font-bold text-gray-800 hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button className="bg-primary text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
              Agendar Visita
            </button>
          </nav>

          {/* Mobile Menu Toggle (Simplified for UI display) */}
          <div className="md:hidden">
            <button className="text-gray-800">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
