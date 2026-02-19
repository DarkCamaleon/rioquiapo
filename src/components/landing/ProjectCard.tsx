
import React from 'react';
import { Project } from '../../types';

import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import Swal from 'sweetalert2';

const ProjectCard: React.FC<{ project: Project; index?: number }> = ({ project, index }) => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  // If index is provided, use it to determine reverse (odd indexes are reversed).
  // Otherwise, fallback to project.reverse property.
  const isReverse = index !== undefined ? index % 2 !== 0 : project.reverse;

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar Proyecto?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'projects', project.id));
        Swal.fire('Eliminado', 'El proyecto ha sido eliminado.', 'success');
      } catch (error) {
        console.error("Error deleting project:", error);
        Swal.fire('Error', 'No se pudo eliminar el proyecto.', 'error');
      }
    }
  };

  return (
    <div className={`flex flex-col ${isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
      {/* Image Container */}
      <div className="w-full lg:w-3/5 group relative overflow-hidden rounded-2xl shadow-2xl">
        <img
          src={project.imageUrl}
          alt={project.name}
          loading="lazy"
          className="w-full h-[350px] sm:h-[450px] object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute top-6 left-6 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-sm`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {project.status}
          </span>
        </div>

        {/* Admin Overlay Actions */}
        {isAdmin && (
          <div className="absolute top-6 right-6 flex gap-2 z-10">
            <Link to={`/admin/projects/edit/${project.id}`} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-colors" title="Editar">
              <span className="material-symbols-outlined text-sm">edit</span>
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition-colors"
              title="Eliminar"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="w-full lg:w-2/5 flex flex-col items-start space-y-6">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <span className="material-symbols-outlined text-lg">location_on</span>
          <span className="text-gray-500 uppercase tracking-wide font-semibold text-xs">{project.location}</span>
        </div>

        <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          {project.name}
        </h3>

        <p className="text-gray-600 text-lg leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-6 py-4 border-y border-gray-100 w-full">
          <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
            <span className="material-symbols-outlined text-gray-400">bed</span>
            {project.bedrooms}
          </div>
          <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
            <span className="material-symbols-outlined text-gray-400">bathroom</span>
            {project.bathrooms}
          </div>
          <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
            <span className="material-symbols-outlined text-gray-400">square_foot</span>
            {project.area}
          </div>
        </div>

        <Link to={`/proyecto/${project.id}`} className="group flex items-center gap-2 border border-gray-200 hover:border-primary px-6 py-3 rounded-lg text-sm font-bold text-gray-800 hover:text-primary transition-all bg-white shadow-sm hover:shadow-md">
          Ver Proyecto
          <span className="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
