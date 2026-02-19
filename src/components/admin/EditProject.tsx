import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import ProjectForm from './ProjectForm';
import { Project } from '../../types';
import Swal from 'sweetalert2';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject(docSnap.data() as Project);
        } else {
          Swal.fire('Error', 'Proyecto no encontrado', 'error');
          navigate('/proyectos');
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
        Swal.fire('Error', 'Error al cargar el proyecto', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleUpdate = async (data: any) => {
    if (!id) return;
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, data);
      await Swal.fire({
        title: '¡Actualizado!',
        text: 'El proyecto ha sido actualizado correctamente.',
        icon: 'success',
        confirmButtonColor: '#f20d0d'
      });
      navigate('/proyectos');
    } catch (error) {
      console.error("Error updating document: ", error);
      Swal.fire('Error', 'No se pudo actualizar el proyecto', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Editar Proyecto</h1>
          <p className="text-gray-600 mt-2">Modifica los detalles del proyecto.</p>
        </div>

        {project && (
          <ProjectForm
            initialData={project}
            onSubmit={handleUpdate}
            buttonText="Guardar Cambios"
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EditProject;
