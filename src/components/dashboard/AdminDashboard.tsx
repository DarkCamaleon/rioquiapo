import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-28 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Bienvenido, Administrador</h2>
            <p className="text-gray-600 mb-6">Aquí podrás gestionar usuarios, propiedades y configuraciones.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">apartment</span>
                  <h3 className="text-xl font-bold text-gray-800">Proyectos</h3>
                </div>
                <p className="text-gray-600 mb-6 text-sm">Administra el catálogo de propiedades, crea nuevos desarrollos o actualiza información.</p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/proyectos"
                    className="text-center w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50 transition-colors"
                  >
                    Ver Catálogo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
