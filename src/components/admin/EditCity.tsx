import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import CityForm, { CityData } from './CityForm';
import Swal from 'sweetalert2';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const EditCity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [city, setCity] = useState<Partial<CityData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCity = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'cities', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCity(docSnap.data() as CityData);
        } else {
          Swal.fire('Error', 'Zona no encontrada', 'error');
          navigate('/proyectos');
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
        Swal.fire('Error', 'Error al cargar la zona', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [id, navigate]);

  const handleUpdate = async (data: CityData) => {
    if (!id) return;
    try {
      const docRef = doc(db, 'cities', id);
      await updateDoc(docRef, { ...data });
      await Swal.fire({
        title: '¡Actualizado!',
        text: 'La zona ha sido actualizada correctamente.',
        icon: 'success',
        confirmButtonColor: '#f20d0d'
      });
      navigate('/proyectos');
    } catch (error) {
      console.error("Error updating document: ", error);
      Swal.fire('Error', 'No se pudo actualizar la zona', 'error');
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
          <h1 className="text-3xl font-extrabold text-gray-900">Editar Zona</h1>
          <p className="text-gray-600 mt-2">Modifica los detalles de la zona.</p>
        </div>

        {city && (
          <CityForm
            initialData={city}
            onSubmit={handleUpdate}
            buttonText="Guardar Cambios"
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EditCity;
