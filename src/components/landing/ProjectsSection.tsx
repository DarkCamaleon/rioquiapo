
import React from 'react';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '../../configs/constants';

const ProjectsSection: React.FC = () => {
  return (
    <section id="proyectos" className="py-24 bg-soft-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Nuestros Proyectos
          </h2>
          <div className="w-16 h-1 bg-primary mb-6"></div>
          <p className="text-gray-500 max-w-2xl font-medium">
            Explora nuestra selección exclusiva de propiedades en la Primera Región.
          </p>
        </div>

        <div className="space-y-32">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
