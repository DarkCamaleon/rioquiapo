import React from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import CityForm, { CityData } from './CityForm';
import Swal from 'sweetalert2';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const NewCity: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = async (data: CityData) => {
    // Generate an ID based on name for cleaner URLs if possible, but Firestore auto-ID is safer for uniqueness.
    // However, the app currently uses 'iquique', 'arica' as IDs for routing (e.g. /proyectos/iquique).
    // If we switch to dynamic IDs, the URLs will be like /proyectos/8f7s8d7f.
    // User probably doesn't mind, but 'slug' based IDs are nicer.
    // For simplicity, we'll let Firestore generate ID, BUT we need to save a 'slug' field or similar if we want readable URLs.
    // Current CityCards uses `city.id` for the link.
    // I'll add a 'slug' or just use ID. The current code matches `city.id`.

    // Auto-generate ID/Slug from name?
    // "Alto Hospicio" -> "alto-hospicio"
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    try {
      // We can use setDoc with a custom ID (slug) to keep URLs pretty!
      // But verify if it exists? For now, addDoc is safer, but I'll try to use the slug as ID if possible.
      // Actually, standard `addDoc` adds a random ID.
      // Let's use `addDoc` and save the slug as a field, OR use `setDoc` with the slug.
      // Using `setDoc` with slug allows `/proyectos/iquique` to keep working if the user recreates it.

      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'cities', slug), {
        ...data,
        id: slug // Store ID inside as well for easier access
      });

      await Swal.fire({
        title: '¡Éxito!',
        text: 'La zona ha sido creada correctamente.',
        icon: 'success',
        confirmButtonColor: '#f20d0d'
      });
      navigate('/proyectos'); // Or /admin
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire('Error', 'No se pudo crear la zona', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Agregar Nueva Zona/Ciudad</h1>
          <p className="text-gray-600 mt-2">Crea una nueva categoría para agrupar proyectos.</p>
        </div>

        <CityForm
          onSubmit={handleCreate}
          buttonText="Crear Zona"
        />
      </main>
      <Footer />
    </div>
  );
};

export default NewCity;
