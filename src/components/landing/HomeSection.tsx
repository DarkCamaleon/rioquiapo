import React from 'react';
import { Link } from 'react-router-dom';

const HomeSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-end justify-center overflow-hidden pb-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('/images/hero-banner.png')`
        }}
      >
      </div>

      {/* Buttons acting as navigation controls for the landing page */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/proyectos">
            <button className="bg-primary hover:bg-red-700 text-white px-10 py-3 rounded font-bold text-sm transition-all shadow-xl shadow-red-600/20 uppercase tracking-wider w-full sm:w-auto">
              Ver Proyectos
            </button>
          </Link>
          <Link to="/contacto">
            <button className="bg-white/90 hover:bg-white text-gray-900 px-10 py-3 rounded font-bold text-sm transition-all shadow-lg uppercase tracking-wider w-full sm:w-auto">
              Contáctanos
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
