import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

export interface City {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  color?: string;
}

const CityCardItem: React.FC<{ city: City; isAdmin: boolean; onDelete: (e: React.MouseEvent, id: string) => void }> = ({ city, isAdmin, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group transform transition-all hover:-translate-y-2 hover:shadow-2xl border border-gray-100/10">
      <Link
        to={`/proyectos/${city.id}`}
        className="block w-full h-full"
      >
        {/* Background: Image or Gradient */}
        {city.imageUrl && !imgError ? (
          <>
            <img
              src={city.imageUrl}
              alt={city.name}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${city.color || 'from-gray-500 to-gray-700'} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-10 pointer-events-none">
          <h3 className="text-3xl font-bold mb-2 uppercase tracking-wider drop-shadow-md">{city.name}</h3>
          <p className="text-white/90 font-medium drop-shadow-sm">{city.description}</p>

          {/* Decoration */}
          <div className="w-12 h-1 bg-white/50 mt-4 rounded-full group-hover:w-20 transition-all duration-300"></div>

          <span className="mt-4 text-xs font-bold uppercase tracking-widest bg-white/20 px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 backdrop-blur-sm">
            Ver Proyectos
          </span>
        </div>
      </Link>

      {/* Admin Controls Overlay */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/admin/cities/edit/${city.id}`}
            className="p-2 bg-white/90 text-blue-600 rounded-full hover:bg-white shadow-md transition-colors"
            title="Editar"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </Link>
          <button
            onClick={(e) => onDelete(e, city.id)}
            className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white shadow-md transition-colors"
            title="Eliminar"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Main Component
const CityCards: React.FC = () => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cities'), (snapshot) => {
      const fetchedCities: City[] = [];
      snapshot.forEach((doc) => {
        fetchedCities.push({ id: doc.id, ...doc.data() } as City);
      });

      setCities(fetchedCities);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener zonas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (e: React.MouseEvent, cityId: string) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    const result = await Swal.fire({
      title: '¿Eliminar Zona?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'cities', cityId));
        Swal.fire('Eliminado', 'La zona ha sido eliminada.', 'success');
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar.', 'error');
      }
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <Link
            to="/admin/cities/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_location_alt</span>
            Agregar Zona
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {cities.map((city) => (
          <CityCardItem key={city.id} city={city} isAdmin={isAdmin} onDelete={handleDelete} />
        ))}
      </div>
    </>
  );
};

export default CityCards;
