
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../configs/constants';
import Logo from '../common/Logo';
import { auth } from '../../configs/firebase';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role } = useAuth();
  const isAdmin = role === 'admin';
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    setMobileOpen(false);
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres salir?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f20d0d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await signOut(auth);
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-bg/95 shadow-md py-2 backdrop-blur-sm' : 'bg-dark-bg py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <Logo className="scale-90 sm:scale-100 origin-left" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm font-bold transition-colors border-b-2 pb-1 ${
                    isActive
                      ? 'text-primary border-primary'
                      : 'text-white border-transparent hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                Panel Admin
              </Link>
            )}

            {!user ? (
              <Link to="/login" className="text-sm font-bold text-white hover:text-primary transition-colors">
                Iniciar Sesión
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-bold text-white hover:text-primary transition-colors"
              >
                Cerrar Sesión
              </button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-1"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className="material-symbols-outlined text-3xl">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-dark-bg/95 backdrop-blur-sm border-t border-white/10 px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 px-4 text-sm font-bold rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-white/5'
                    : 'text-white hover:text-primary hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-3 px-4 text-sm font-bold text-yellow-400 hover:text-yellow-300 hover:bg-white/5 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              Panel Admin
            </Link>
          )}

          <div className="border-t border-white/10 pt-2 mt-2">
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-4 text-sm font-bold text-white hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left py-3 px-4 text-sm font-bold text-white hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
