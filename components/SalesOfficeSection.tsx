
import React from 'react';

const SalesOfficeSection: React.FC = () => {
  return (
    <section id="contacto" className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Info Side */}
          <div className="w-full lg:w-1/3">
            <div className="mb-10">
              <span className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-[10px] mb-2">
                <span className="w-8 h-[1px] bg-primary"></span>
                Ubicación
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Visita Nuestra Sala de Ventas
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Oficina Principal</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Av. Arturo Prat 3050, Oficina 401<br />
                    Iquique, Tarapacá
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Horario de Atención</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Lunes a Viernes: 09:30 - 18:30<br />
                    Sábados: 10:00 - 14:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Contacto Directo</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    +56 57 2345 6789<br />
                    ventas@rioquiapo.cl
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className="w-full lg:w-2/3">
            <div className="relative h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 group">
              {/* Using the image from the user prompt's screenshot */}
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoKhzOVxbina9Y4HxjKDbMOMidYNdAOlMcFeMZyFwCjlrj1dfpqzjugmlfbKos6-dzx37ZU4iYa4tffaQtHuRtfhPvkx6mZeouaCSm2GH6EDvrObk9pe081HDWFhPAbQ07_TIaZ7g0J3xxXSzY_GEytmxgWu6l3Gpju6YRYAEiWqJaSToMtPJMSaZ7E2ffpigNnjv3XZPV5pfNZ7n9eiB6Qp6-kK3QnoUs5Vs8CVSmWDCBCVX1HLFsMncOsNl05xdv4V9-pTh9rmon')`
                }}
              ></div>
              
              {/* Map Overlay Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-primary p-2.5 rounded-full shadow-xl animate-bounce">
                  <span className="material-symbols-outlined text-white text-3xl">location_on</span>
                </div>
                <div className="mt-2 bg-white px-3 py-1 rounded shadow-md text-[10px] font-bold uppercase tracking-wider text-gray-800">
                  Sala de Ventas
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SalesOfficeSection;
