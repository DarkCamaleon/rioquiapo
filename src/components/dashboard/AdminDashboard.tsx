import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../configs/firebase';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro de que quieres salir?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f20d0d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await signOut(auth);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenido, Administrador</h2>
          <p className="text-gray-600">Aquí podrás gestionar usuarios, propiedades y configuraciones.</p>
          {/* Add admin features here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
