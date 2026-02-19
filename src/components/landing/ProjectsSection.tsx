import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import CityCards from './CityCards';
import { Project } from '../../types';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../configs/firebase';

interface ProjectsSectionProps {
  projects?: Project[];
  title?: string;
  showCityCards?: boolean;
  showProjectList?: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects: propProjects,
  title = "Nuestros Proyectos",
  showCityCards = true,
  showProjectList = true
}) => {
  const [projects, setProjects] = useState<Project[]>(propProjects || []);
  const [loading, setLoading] = useState(!propProjects);

  useEffect(() => {
    if (propProjects) {
      setProjects(propProjects);
      return;
    }

    const q = query(collection(db, "projects"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedProjects: Project[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
      });

      setProjects(fetchedProjects);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [propProjects]);

  return (
    <section id="proyectos" className="py-24 bg-soft-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* City Cards Section - Only show if requested */}
        {showCityCards && <CityCards />}

        {showProjectList && (
          <>
            <div className="mb-20">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                {title}
              </h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <p className="text-gray-500 max-w-2xl font-medium">
                Explora nuestra selección exclusiva de propiedades en la Primera Región.
              </p>
            </div>

            {loading ? (
              <div className="space-y-32">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 animate-pulse">
                    <div className="w-full lg:w-3/5 h-[350px] sm:h-[450px] bg-gray-200 rounded-2xl"></div>
                    <div className="w-full lg:w-2/5 flex flex-col space-y-4">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-48 h-8 bg-gray-200 rounded"></div>
                      <div className="w-full h-16 bg-gray-200 rounded"></div>
                      <div className="flex gap-6">
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-32">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
