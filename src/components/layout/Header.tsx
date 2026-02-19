
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../configs/constants';
import Logo from '../common/Logo';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, role } = useAuth();
  const isAdmin = role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-bg/95 shadow-md py-2 backdrop-blur-sm' : 'bg-dark-bg py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/">
            <Logo className="scale-90 sm:scale-100 origin-left" />
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-bold text-white hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* Admin Dashboard Link */}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                Panel Admin
              </Link>
            )}

            {/* Login / Logout Logic (Optional enhancement based on request context) */}
            {!user ? (
              <Link to="/login" className="text-sm font-bold text-white hover:text-primary transition-colors">
                Iniciar Sesión
              </Link>
            ) : (
              // Optionally show a logout or profile link here, but for now user just asked for Admin panel visibility
              // We'll keep it simple and just show Admin Panel if admin.
              // If logged in but not admin (e.g. user), we might show nothing or 'Mi Cuenta'
              // For now, let's just respect the Login link removal if logged in.
              null
            )}

            <button className="bg-primary text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
              Agendar Visita
            </button>
          </nav>

          {/* Mobile Menu Toggle (Simplified for UI display) */}
          <div className="md:hidden">
            <button className="text-white">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
