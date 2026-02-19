import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import ProjectForm from './ProjectForm';
import Swal from 'sweetalert2';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city');

  // Format city name for display/storage
  const formatCityName = (slug: string | null) => {
    if (!slug) return '';
    // Simple case conversion: "alto-hospicio" -> "Alto Hospicio"
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const initialLocation = formatCityName(cityParam);

  const handleCreate = async (data: any) => {
    try {
      const dataToSave = {
        ...data,
        cityId: cityParam || null // Save cityId if available
      };
      await addDoc(collection(db, 'projects'), dataToSave);
      await Swal.fire({
        title: '¡Éxito!',
        text: 'El proyecto ha sido creado correctamente.',
        icon: 'success',
        confirmButtonColor: '#f20d0d'
      });
      // Redirect back to the city page if we came from there, otherwise to all projects
      if (cityParam) {
        navigate(`/proyectos/${cityParam}`);
      } else {
        navigate('/proyectos');
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire('Error', 'No se pudo crear el proyecto', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Crear Nuevo Proyecto</h1>
          <p className="text-gray-600 mt-2">Completa la información para agregar un nuevo desarrollo inmobiliario.</p>
        </div>

        <ProjectForm
          onSubmit={handleCreate}
          buttonText="Crear Proyecto"
        />
      </main>
      <Footer />
    </div>
  );
};

export default NewProject;
