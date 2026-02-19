
import React from 'react';
import { Project } from '../../types';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const isReverse = project.reverse;

  return (
    <div className={`flex flex-col ${isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
      {/* Image Container */}
      <div className="w-full lg:w-3/5 group relative overflow-hidden rounded-2xl shadow-2xl">
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-[350px] sm:h-[450px] object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute top-6 ${isReverse ? 'right-6' : 'left-6'} bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-sm`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {project.status}
          </span>
        </div>
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

        <button className="group flex items-center gap-2 border border-gray-200 hover:border-primary px-6 py-3 rounded-lg text-sm font-bold text-gray-800 hover:text-primary transition-all bg-white shadow-sm hover:shadow-md">
          Ver Galería
          <span className="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
