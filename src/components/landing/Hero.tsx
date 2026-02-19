
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[650px] sm:h-[750px] w-full flex items-center overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCS929R5QpjaBHisxUt7nI6gfEaIPm8QzJbrjw1XEUZ2_LF6apJ1RKmLiI_rpgwG5_HTYY8zTfjm68h6ge0mGNA2QkmaSGUM6LMI9PVjZaRMxLGTn34qDZVe5s07on_UIxz4tgsoXxJF3fkRuwfi6GtCQsbdYHkSDu3ynxFKCqH-OEuWFRifT4fYwscX58CMBdN3f5mBEJn0JtWtd6aoDyZLTxeiANV3jaPhIKOw2pCjm4IVESBgCSamByZFWOuyCxeE9b_fPct2sR9')`
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl text-white">
          <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 py-1.5 px-3 bg-primary/20 backdrop-blur-sm border border-white/20 rounded">
            Exclusividad y Diseño Norteño
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.1] mb-6">
            Encuentra tu próximo <span className="text-primary">hogar</span> en Iquique y Hospicio.
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-10 max-w-lg leading-relaxed font-medium">
            Proyectos inmobiliarios modernos con vistas al mar y ubicaciones estratégicas en la Región de Tarapacá.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-primary hover:bg-red-700 text-white px-10 py-4 rounded font-bold text-sm transition-all shadow-xl shadow-red-600/20">
              Ver Proyectos
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-10 py-4 rounded font-bold text-sm transition-all">
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
