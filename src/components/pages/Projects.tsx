import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ProjectsSection from '../landing/ProjectsSection';

const Projects: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <ProjectsSection showProjectList={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
