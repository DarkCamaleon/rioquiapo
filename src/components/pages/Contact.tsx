import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import SalesOfficeSection from '../landing/SalesOfficeSection';

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <SalesOfficeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
