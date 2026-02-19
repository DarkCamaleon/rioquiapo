import React from 'react';
import Header from '../layout/Header';
import Hero from './Hero';
import ProjectsSection from './ProjectsSection';
import SalesOfficeSection from './SalesOfficeSection';
import Footer from '../layout/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ProjectsSection />
        <SalesOfficeSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
