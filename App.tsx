
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import SalesOfficeSection from './components/SalesOfficeSection';
import Footer from './components/Footer';

const App: React.FC = () => {
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

export default App;
