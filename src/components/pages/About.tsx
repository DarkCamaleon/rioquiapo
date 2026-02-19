import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        {/* Us Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80')`
            }}
          >
            <div className="absolute inset-0 bg-gray-900/60 z-10"></div>
          </div>
          <div className="relative z-20 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Sobre Nosotros
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Construyendo sueños y hogares en la Región de Tarapacá desde hace más de 15 años.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">
                  Nuestra Historia
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Río Quiapo Inmobiliaria
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Somos una empresa inmobiliaria comprometida con el desarrollo urbano y la calidad de vida en el norte de Chile. Nacimos con la visión de crear espacios que no solo sean viviendas, sino verdaderos hogares donde las familias puedan crecer y prosperar.
                  </p>
                  <p>
                    Nuestra experiencia en el mercado nos permite identificar las mejores ubicaciones y diseñar proyectos que se integran armónicamente con el entorno, aprovechando las bondades naturales de nuestra región, como la vista al mar y el clima privilegiado.
                  </p>
                  <p>
                    Cada proyecto de Río Quiapo es el resultado de un trabajo meticuloso, donde la arquitectura moderna se une a la funcionalidad y la sostenibilidad.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Edificio moderno"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-2xl">flag</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nuestra Misión</h3>
                <p className="text-gray-600">
                  Desarrollar proyectos inmobiliarios de excelencia que superen las expectativas de nuestros clientes, aportando valor a la comunidad y respetando el medio ambiente.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-2xl">visibility</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nuestra Visión</h3>
                <p className="text-gray-600">
                  Ser la inmobiliaria líder en la zona norte, reconocida por nuestra innovación, calidad constructiva y compromiso con el bienestar de las familias.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
